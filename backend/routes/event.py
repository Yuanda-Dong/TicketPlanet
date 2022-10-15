from fastapi import APIRouter, Body, Request, Response, HTTPException, status, Depends
from fastapi.encoders import jsonable_encoder
from models.event import Event, EventInDB, EventUpdate
from models.user import User
from util.oAuth import get_current_user
from typing import List
from pymongo import ReturnDocument

router = APIRouter()


@router.post("/", response_description="Create a new event", status_code=status.HTTP_201_CREATED, response_model=EventInDB)
def create_event(request: Request, event: Event = Body(...), user: User = Depends(get_current_user)):
    event = jsonable_encoder(event)
    event["host_id"] = user["_id"]
    event["tickets"] = []
    new_event = request.app.database["events"].insert_one(event)
    created_event = request.app.database["events"].find_one(
        {"_id": new_event.inserted_id}
    )
    
    return created_event

@router.get("/", response_description="Get all events", response_model=List[EventInDB])
def list_events(request: Request):
    events = list(request.app.database["events"].find(limit=100))
    return events

@router.get("/{id}", response_description="Get a single event by id", response_model=EventInDB)
def find_event(id: str, request: Request):
    if (event := request.app.database["events"].find_one({"_id": id})) is not None:
        return event
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"event with ID {id} not found")

@router.put("/{id}", response_description="Update an event", response_model=EventInDB)
def update_event(id: str, request: Request, event: EventUpdate, user: User = Depends(get_current_user)):
    if (
        existing_event := request.app.database["events"].find_one({"_id": id})
    ) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Event with ID {id} not found")
    
    if existing_event["host_id"] != user["_id"]:
         raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Only the owner of this event can edit it")
    
    event = {k: v for k, v in event.dict().items() if v is not None}
        
    if len(event) >= 1:
        updated_result = request.app.database["events"].find_one_and_update(
            {"_id": id}, {"$set": event}, return_document=ReturnDocument.AFTER
        )
        return updated_result
    return existing_event

@router.delete("/{id}", response_description="Delete a user")
def delete_event(id: str, request: Request, response: Response, user: User = Depends(get_current_user)):
    if(
        found_event := request.app.database["events"].find_one({"_id": id})
    ) is not None: 
        if found_event["host_id"] != user["_id"]:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Only the owner of this event can delete this")
        delete_result = request.app.database["events"].delete_one({"_id": id})
        if delete_result.deleted_count == 1:
            response.status_code = status.HTTP_204_NO_CONTENT
            return response

    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Event with ID {id} not found")