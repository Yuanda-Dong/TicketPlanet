import json
from typing import List
from bson.objectid import ObjectId
from fastapi.encoders import jsonable_encoder
from fastapi import APIRouter, Body, Request, Response, HTTPException, status, Depends
from pymongo import ReturnDocument
from models.ticket import TicketStatus, TicketInstance
import stripe
import os

from util.send_email import buy_notice

stripe.api_key = os.getenv("STRIPE_API_KEY")
webhook_secret = 'whsec_49b15278a690057b4d5fcd818a85d9e1db99a3ede387e8dee41b70f5c15ab41e' #os.getenv("STRIPE_WEBHOOK") ### <--- update here to stripe cli key if you're testing locally
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

          await buy_notice(request, found_ticket["event_id"], found_ticket["user_id"])
        else:
          print(f"Ticket {ticket} has not been found")
      
    # ... handle other event types
    else:
      print('Unhandled event type {}'.format(event['type']))

    return {'success':True}
    
# @router.post('/bookings/refund', response_model=List[TicketInstance])
# async def refund_bookings(payment_intent:str, pass_ids request: Request):           
#     if(
#       found_bookings := list(request.app.database["passes"].find({"payment_intent": payment_intent }))
#     ) is not None: 
#         for booking in found_bookings:
#           booking['_id'] = str(booking["_id"])
#         return found_bookings
    
#     raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
#                       detail=f"no bookings exist with payment intent: {payment_intent}")

@router.get("/testBookSendEmail/")
async def hello(request: Request, id: str, user: str):
    await buy_notice(request, id, user)