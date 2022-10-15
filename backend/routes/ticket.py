from models.ticket import Ticket, TicketUpdate, TicketInDB
from models.user import User
from util.oAuth import get_current_user
from fastapi import APIRouter, Body, Request, Response, HTTPException, status, Depends
from fastapi.encoders import jsonable_encoder
from typing import List

router = APIRouter()

@router.post("/{event_id}", response_description="Add ticket to event", status_code=status.HTTP_201_CREATED, response_model=TicketInDB)
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
    created_ticket = request.app.database["tickets"].find_one(
        {"_id": new_ticket.inserted_id}
    )
    
    return created_ticket

@router.get("/{event_id}", response_description="Get all tickets to an event", response_model=List[TicketInDB])
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
    ticket = user = {k: v for k, v in ticket.dict().items() if v is not None}
    if (
        existing_ticket := request.app.database["tickets"].find_one({"_id": id})
    ) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"ticket with ID {id} not found")

    if existing_ticket["host_id"] != user["_id"]:
         raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Only the owner of this ticket can edit it")
                   
    if len(ticket) >= 1:
        updated_result = request.app.database["tickets"].update_one(
            {"_id": id}, {"$set": ticket}
        )
        return updated_result
    return existing_ticket

@router.delete("/{id}", response_description="Delete a ticket")
def delete_ticket(id: str, request: Request, response: Response, user: User = Depends(get_current_user)):
    if(
        found_ticket := request.app.database["tickets"].find_one({"_id": id})
    ) is not None: 
        if found_ticket["host_id"] != user["_id"]:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Only the owner of this ticket can delete this")
        delete_result = request.app.database["tickets"].delete_one({"_id": id})
        if delete_result.deleted_count == 1:
            response.status_code = status.HTTP_204_NO_CONTENT
            return response

    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Ticket with ID {id} not found")
    
@router.post("/buy/{id}", response_description="Buy a ticket", response_model=TicketInDB)
def delete_ticket(id: str, quantity: int, request: Request, response: Response):
    if(
        found_ticket := request.app.database["tickets"].find_one({"_id": id})
    ) is not None: 
        ## this is a dummy method that will just check quantity and decrement for now
        if found_ticket["availability"] >= quantity:
            found_ticket["avialability"] -= quantity
            updated_ticket = request.app.database["tickets"].update_one(
            {"_id": id}, {"$set": found_ticket}
            )
            ## will need to return list of ticket instances
            return updated_ticket
           
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail=f"Ticket with ID {id} does not have enough availability")
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Ticket with ID {id} not found")