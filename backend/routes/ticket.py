from calendar import c
from models.ticket import Ticket, TicketUpdate, TicketInDB, TicketStatus
from models.user import User
from models.payment import TicketPaymentSession
from util.oAuth import get_current_user
from fastapi import APIRouter, Body, Request, Response, HTTPException, status, Depends
from fastapi.encoders import jsonable_encoder
from typing import List, Optional, Tuple
import os
from pymongo import ReturnDocument
import stripe
from util.send_email import buy_notice
stripe.api_key = os.getenv("STRIPE_API_KEY")
router = APIRouter()


@router.post("/e/{event_id}", response_description="Add ticket to event", status_code=status.HTTP_201_CREATED, response_model=TicketInDB)
def create_ticket(event_id: str, request: Request, ticket: Ticket = Body(...), user: User = Depends(get_current_user)):
    if(
        found_event := request.app.database["events"].find_one({"_id": event_id})
    ) is not None: 
        if found_event["host_id"] != user["_id"]:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Only the owner of this event can add tickets")
    
    ticket = jsonable_encoder(ticket)
    ticket["event_id"] = event_id
    ticket["host_id"] = found_event["host_id"]
    new_ticket = request.app.database["tickets"].insert_one(ticket)
    
    current_tickets = found_event["tickets"]
    created_ticket = request.app.database["tickets"].find_one(
        {"_id": new_ticket.inserted_id}
    )
    current_tickets.append(new_ticket.inserted_id)
    updated_event = request.app.database["events"].find_one_and_update({"_id": event_id}, {"$set":{'tickets':current_tickets}})
    
    return created_ticket

@router.get("/e/{event_id}", response_description="Get all tickets to an event", response_model=List[TicketInDB])
def list_tickets(event_id: str, request: Request):
    tickets = list(request.app.database["tickets"].find({"event_id": event_id},limit=100))
    return tickets

@router.get("/{id}", response_description="Get a single ticket by id", response_model=TicketInDB)
def find_ticket(id: str, request: Request):
    if (ticket := request.app.database["tickets"].find_one({"_id": id})) is not None:
        return ticket
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"ticket with ID {id} not found")

@router.put("/{id}", response_description="Update a ticket", response_model=TicketInDB)
def update_ticket(id: str, request: Request, ticket: TicketUpdate, user: User = Depends(get_current_user)):
    ticket = {k: v for k, v in ticket.dict().items() if v is not None}
    
    if (
        existing_ticket := request.app.database["tickets"].find_one({"_id": id})
    ) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"ticket with ID {id} not found")

    if existing_ticket["host_id"] != user["_id"]:
         raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Only the owner of this ticket can edit it")
                   
    if len(ticket) >= 1:
        updated_result = request.app.database["tickets"].find_one_and_update(
            {"_id": id}, {"$set": ticket}, return_document=ReturnDocument.AFTER
        )
        return updated_result
    return existing_ticket

@router.delete("/{id}", response_description="Delete a ticket")
def delete_ticket(id: str, request: Request, response: Response, user: User = Depends(get_current_user)):
    if(
        found_ticket := request.app.database["tickets"].find_one({"_id": id})
    ) is not None:
        event_id = found_ticket["event_id"]
        event = request.app.database["events"].find_one({"_id": event_id })
        if found_ticket["host_id"] != user["_id"]:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Only the owner of this ticket can delete this")
        try:     
            event["tickets"].remove(id)
            request.app.database["events"].find_one_and_update(
                {"_id": event_id}, {"$set": event}, return_document=ReturnDocument.AFTER
             )
        except ValueError:
            pass
        
        delete_result = request.app.database["tickets"].delete_one({"_id": id})
        # refund if active 
        if delete_result.deleted_count == 1:
            response.status_code = status.HTTP_204_NO_CONTENT
            return response
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Ticket with ID {id} not found")
        
@router.post("/session/{id}", response_description="Buy a ticket", status_code=status.HTTP_201_CREATED)
def buy_ticket(id: str, payment: TicketPaymentSession, request: Request, user: User = Depends(get_current_user)):
    if(
        found_ticket := request.app.database["tickets"].find_one({"_id": id})
    ) is not None: 
        print(os.getenv("STRIPE_API_KEY"))
        ## first decrement the tickets so you lock the tickets to the payment intent
        if payment.line_items[0].quantity > 15:
            raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail=f"Can only purchase 15 tickets at a time") #stripe limitations on 500 characters
        
        if found_ticket["availability"] >= payment.line_items[0].quantity:
            updated_ticket = adjust_ticket_availability(id, found_ticket, -payment.line_items[0].quantity, request)
            physical_tickets = create_physical_tickets(id, found_ticket['event_id'], user['_id'],request, payment.line_items[0].quantity, payment.metadata.seats)
            #create physical ticket ids
            payment.metadata.seat_ids = physical_tickets
            
            #payment intent
            try: 
                payment_intent = stripe.checkout.Session.create(
                    cancel_url = payment.cancel_url,
                    success_url = payment.success_url,
                    mode=payment.mode,
                    customer_email = payment.customer_email,
                    line_items = jsonable_encoder(payment.line_items),
                    payment_intent_data={
                        'receipt_email': payment.customer_email,
                        'setup_future_usage':'on_session'
                    },
                    metadata={
                        'seat_ids' : ",".join(physical_tickets),
                        'seats': str(payment.metadata.seats).strip(' []') 
                    }
                )
                buy_notice(request, found_ticket["event_id"], user["_id"])
                return payment_intent  # attached physical ticket 
            
            except stripe.error.StripeError as e:
                adjust_ticket_availability(id, found_ticket, payment.line_items[0].quantity, request)
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                    detail=e.user_message)
            except Exception as e: 
                adjust_ticket_availability(id, found_ticket, payment.line_items[0].quantity, request)
                print(e.message)
                raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
           
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail=f"Ticket with ID {id} does not have enough availability")
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Ticket with ID {id} not found")

def adjust_ticket_availability(id: str, ticket:TicketInDB, quantity:int, request:Request):
        ticket['availability'] += quantity
        updated_ticket = request.app.database["tickets"].update_one(
        {"_id": id}, {"$set": ticket}
        )
        return updated_ticket
        
def create_physical_tickets(baseticket:str, event_id: str, userId: str, request:Request, quantity:int = 0, seats:Optional[List[Tuple[int,int]]]=[]):
    
    event = request.app.database["events"].find_one({"_id": event_id })
    
    if event is None: 
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Event associated with ticket no longer exists")
        
    seat_plan_id = "" if 'seat_plan' not in event else event['seat_plan']
        
    ticket_ids =  []
    n_seats = len(seats)
    
    if n_seats > 0 and quantity != 0 and n_seats != quantity:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Quantity does not match size of seat list")
    

    
    if n_seats > 0: 
        if seat_plan_id == "":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Seats provided but no seat plan")
        seat_plan = request.app.database['seat_plan'].find_one({"_id": seat_plan_id})
        
        if seat_plan is None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Seatplan {seat_plan_id} does not exist")
        
        for seat in seats:
            print(len(seat_plan["seats"][seat[0]][seat[1]]))
            print(seat_plan["seats"][seat[0]][seat[1]])
            if seat[0] >= len(seat_plan["seats"]) or seat[1] >= len(seat_plan["seats"][seat[0]]) or seat[0] < 0 or seat[1] < 0:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Seats {seat[0]}-{seat[1]} is not a valid seat")
            if seat_plan["seats"][seat[0]][seat[1]]["active"] == False or seat_plan["seats"][seat[0]][seat[1]]["ticket_id"] != "":
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Seats {seat[0]}-{seat[1]} is either taken or unavailable")
        
            new_ticket = {
                'base_id': baseticket,
                'seat': str(seat[0]) + "-" + str(seat[1]),
                'user_id': userId, 
                'status': TicketStatus.deactive,
                'event_id': event_id
            }
            new_ticket = request.app.database["passes"].insert_one(new_ticket)
            ticket_ids.append(str(new_ticket.inserted_id))
            seat_plan["seats"][seat[0]][seat[1]]["ticket_id"] = str(new_ticket.inserted_id)
        
        # if all seats are valid update the seat plan 
        updated_seat_plan = request.app.database["seat_plan"].update_one(
        {"_id": seat_plan_id}, {"$set": seat_plan}
        )
    else:
        for i in range(quantity):
            new_ticket = {
                'base_id': baseticket,
                'seat': "No Assigned Seat",
                'user_id': userId, 
                'status': TicketStatus.deactive,
                'event_id': event_id
            }
            new_ticket = request.app.database["passes"].insert_one(new_ticket)
            ticket_ids.append(str(new_ticket.inserted_id))
        
        
    return ticket_ids
    
# @router.post("/buy/{id}", response_description="Buy a ticket", status_code=status.HTTP_201_CREATED,
#              response_model=PaymentIntentReturn)
#def buy_ticket(id: str, payment: TicketPaymentIntent, request: Request, user: User = Depends(get_current_user)):
#     if(
#         found_ticket := request.app.database["tickets"].find_one({"_id": id})
#     ) is not None: 
#         ## first decrement the tickets so you lock the tickets to the payment intent
#         if found_ticket["availability"] >= payment.metadata.quantity:
#             updated_ticket = adjust_ticket_availability(id, found_ticket, -payment.metadata.quantity, request)
#             #create physical ticket ids
            
#             #payment intent
#             try: 
#                 payment_intent = stripe.PaymentIntent.create(
#                     amount=payment.amount,
#                     currency=payment.currency,
#                     payment_method_types=['card'],
#                     metadata=jsonable_encoder(payment.metadata)
#                 )
#                 return {'clientSecret': payment_intent.client_secret}   # attached physical ticket 
            
#             except stripe.error.StripeError as e:
#                 adjust_ticket_availability(id, updated_ticket, payment.metadata.quantity, request)
#                 raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
#                                     detail=e.user_message)
#             except Exception as e: 
#                 adjust_ticket_availability(id, updated_ticket, payment.metadata.quantity, request)
#                 raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
           
#         raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail=f"Ticket with ID {id} does not have enough availability")
#     raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Ticket with ID {id} not found")
    
#    return

# @router.get("/testBuyNotice/")
# async def hello(request: Request, id: str, user: str):
#     await buy_notice(request, id, user)
