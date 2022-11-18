import json
import threading

from typing import List
from bson.objectid import ObjectId
from fastapi.encoders import jsonable_encoder
from fastapi import APIRouter, Body, Request, Response, HTTPException, status, Depends
from pymongo import ReturnDocument
from models.ticket import TicketStatus, TicketInstance
from models.user import User
from models.payment import SeatRefunds
from util.oAuth import get_current_user
from routes.ticket import adjust_ticket_availability
import stripe
import os
import asyncio
import threading
from util.send_email import buy_notice, cancel_book
import nest_asyncio
stripe.api_key = os.getenv("STRIPE_API_KEY")
# webhook_secret = 'whsec_49b15278a690057b4d5fcd818a85d9e1db99a3ede387e8dee41b70f5c15ab41e' #os.getenv("STRIPE_WEBHOOK") ### <--- update here to stripe cli key if you're testing locally
# webhook_secret = os.getenv("STRIPE_WEBHOOK") ### <--- update here to stripe cli key if you're testing locally
webhook_secret = 'whsec_49b15278a690057b4d5fcd818a85d9e1db99a3ede387e8dee41b70f5c15ab41e'
router = APIRouter()
###
# Payment Flow
# Intent -> this will create a payment intent with the quantity and amount of tickets to be purchased
#           -> lock the pontential tickets 
#           -> create deactivated physical tickets & link to payment object
#           -> return payment object
# Payment -> user/card details 
#          -> if (cancel) -> release locked tickets, delete physical tickets, close payment intent
#          -> 
###


@router.post('/webhook')
async def webhook(request: Request):   
    event = None
    payload = await request.body()
    print(request.headers)
    sig_header = request.headers['stripe-signature']

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, webhook_secret
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail=e.message)
    except stripe.error.SignatureVerificationError as e:
         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=e.user_message)

    # Handle the event
    if event['type'] == 'payment_intent.amount_capturable_updated':
      payment_intent = event['data']['object']
    elif event['type'] == 'payment_intent.canceled':
      payment_intent = event['data']['object']
    elif event['type'] == 'payment_intent.created':
        print('this actually worked')
        payment_intent = event['data']['object']
        print(payment_intent)
    elif event['type'] == 'payment_intent.partially_funded':
      payment_intent = event['data']['object']
    elif event['type'] == 'payment_intent.payment_failed':
      payment_intent = event['data']['object']
    elif event['type'] == 'payment_intent.processing':
      payment_intent = event['data']['object']
    elif event['type'] == 'payment_intent.requires_action':
      payment_intent = event['data']['object']
    elif event['type'] == 'payment_intent.succeeded':
      payment_intent = event['data']['object']
    elif event['type'] == 'checkout.session.completed':
      print("session completed")
      session = event['data']['object']
      tickets = session['metadata']['seat_ids'].split(',')
      
      print(session['metadata']['seat_ids'])
      for ticket in tickets:
        print(type(ticket))
        ticket = ticket.strip()
        
        if(
          found_ticket := request.app.database["passes"].find_one({"_id": ObjectId(ticket)})
        ) is not None: 
          found_ticket["status"] = TicketStatus.active
          found_ticket["payment_intent"] = session['payment_intent']
          updated_ticket = request.app.database["passes"].find_one_and_update(
            {"_id": found_ticket["_id"]}, {"$set": found_ticket}, return_document=ReturnDocument.AFTER
          )
          print(f"Ticket {ticket} has been made active")
          print(updated_ticket)
          try: 
            await buy_notice(request, found_ticket["event_id"], found_ticket["user_id"])
          except:
            print("skipped connection error")
            continue
        else:
          print(f"Ticket {ticket} has not been found")
      
    # ... handle other event types
    else:
      print('Unhandled event type {}'.format(event['type']))

    return {'success':True}
    
@router.post('/refund/{payment_intent_id}')
async def refund_bookings(payment_intent_id:str, request: Request, pass_ids:List[str] = [], user:User = Depends(get_current_user)):
    found_bookings = list(request.app.database["passes"].find({"payment_intent": payment_intent_id }))
    
    if found_bookings: 
        if  not user['_id'] ==  found_bookings[0]['user_id']:
          raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Only the user who purchased this tickets can request refunds")
            
        to_refund = list(filter(lambda booking: str(booking['_id']) in pass_ids and booking['status'] == 'active', found_bookings)) if pass_ids else list(filter(lambda booking: booking['status'] == 'active',found_bookings))
        
        if not to_refund:
          raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
              detail=f"No applicable tickets to be refunded ")
          
        if len(pass_ids) > 0 and not len(to_refund) == len(pass_ids):
          raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                      detail=f"List of Pass IDs contains invalid ids")
        
        base_ticket_cost = 0 
        total_to_refund = 0
        for booking in to_refund:
          booking['_id'] = str(booking['_id'])
          if 'price' in booking:
            total_to_refund += booking['price'] 
          else: 
            if base_ticket_cost == 0: 
              base_ticket = request.app.database['tickets'].find_one({"_id": booking['base_id']})
              base_ticket_cost = base_ticket['price'] * 100 
            total_to_refund += base_ticket_cost
        
        remove_from_seatplan(to_refund, request)
        refunded = refund(payment_intent_id, total_to_refund)
        print(to_refund) 
        print(f'amount to refund:{total_to_refund}')

        nest_asyncio.apply()
        thread_loop = asyncio.new_event_loop()
        threading.Thread(target=start_loop, args=(thread_loop,)).start()
        mail_loop = asyncio.get_event_loop()
        mail_loop.run_until_complete(cancel_mail_sender(found_bookings, request, user['_id'], thread_loop))

        return refunded
    
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                      detail=f"no bookings exist with payment intent: {payment_intent_id}")

def refund(paymentId: str, amount: int):
  try: 
    refund = stripe.Refund.create(
      payment_intent=paymentId,
      amount = int(amount)
    )
    return refund 
    
  except stripe.error.StripeError as e:
   raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                      detail=e.user_message)
                      
def remove_from_seatplan(tickets:List[TicketInstance], request:Request):
    if (
      found_event := request.app.database["events"].find_one({"_id": tickets[0]['event_id']})        
    ) is not None:
        if 'seat_plan' in found_event and found_event['seat_plan'] != "":                     
          found_plan = request.app.database["seat_plan"].find_one(
              {"_id": found_event['seat_plan']}
          )
          if found_plan is None:
              raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                      detail=f"This seat plan no longer exists")
          for ticket in tickets:
            seat = ticket["seat"].split('-')
            found_plan['seats'][int(seat[0])][int(seat[1])]["ticket_id"] = ""
        
          updated_seat_plan = request.app.database["seat_plan"].update_one(
          {"_id": found_event['seat_plan']}, {"$set": found_plan}
          )
                
        base_ticket = request.app.database['tickets'].find_one({"_id": tickets[0]['base_id']})
        
        request.app.database['tickets'].update_one({"_id": tickets[0]['base_id']}, {"$set":{"availability": base_ticket['availability'] + len(tickets)}})
        
        for ticket in tickets:
          refunded_ticket = request.app.database["passes"].update_one(
          {"_id": ObjectId(ticket['_id'])}, {"$set": {"status":"refunded"}}
          )

def start_loop(thread_loop):
    asyncio.set_event_loop(thread_loop)
    thread_loop.run_forever()


async def cancel_mail_sender(found_bookings, request, user, loop):
    events = []
    for booking in found_bookings:
        events.append(booking['event_id'])
    events = set(events)
    for event in events:
        asyncio.run_coroutine_threadsafe(cancel_book(request, event, user), loop)



@router.get("/test_cancel_email/")
async def test_cancel_email(request: Request, user: str):
    nest_asyncio.apply()
    found_bookings = list(request.app.database['events'].find())

    thread_loop = asyncio.new_event_loop()
    threading.Thread(target=test_start_loop, args=(thread_loop, )).start()
    mail_loop = asyncio.get_event_loop()
    mail_loop.run_until_complete(test_cancel_mail_sender(found_bookings, request, user, thread_loop))

    return "hello!!"


def test_start_loop(thread_loop):
    asyncio.set_event_loop(thread_loop)
    thread_loop.run_forever()


async def test_cancel_mail_sender(found_bookings, request, user, loop):
    events = []
    for booking in found_bookings:
        events.append(booking['_id'])
    events = set(events)
    for event in events:
        asyncio.run_coroutine_threadsafe(cancel_book(request, event, user), loop)