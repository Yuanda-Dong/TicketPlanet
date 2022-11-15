import math
import re
from datetime import datetime
from tkinter import S
# from datetime import datetime
from typing import List
import stripe
import pymongo
from fastapi import APIRouter, Body, Request, Response, HTTPException, status, Depends
from fastapi.encoders import jsonable_encoder
from pymongo import ReturnDocument
from models.event import Event, EventInDB, EventUpdate, SeatPlan, SeatPlanInDB, SeatPlanUpdate
from models.user import User
from util.oAuth import get_current_user
from models.filter import Filter
from util.postcode_to_distance import distance_post
import dateutil
from models.report import Report
from util.send_email import event_update_notice, event_update_template, event_publish

router = APIRouter()


@router.post("/", response_description="Create a new event", status_code=status.HTTP_201_CREATED,
             response_model=EventInDB)
def create_event(request: Request, event: Event = Body(...), user: User = Depends(get_current_user)):
    event = jsonable_encoder(event)
    event["host_id"] = user["_id"]
    event["tickets"] = []
    event["published"] = False
    new_event = request.app.database["events"].insert_one(event)
    created_event = request.app.database["events"].find_one(
        {"_id": new_event.inserted_id}
    )

    return created_event


@router.get("/", response_description="Get all events", response_model=List[EventInDB])
def list_events(request: Request):
    events = list(request.app.database["events"].find(limit=100))
    return events

@router.get("/upcoming", response_description="Get all events upcoming events", response_model=List[EventInDB])
def list_events(pageSize: int, pageNum: int, request: Request):
    d = datetime.utcnow().isoformat()
    events = list(request.app.database["events"].find({"published": True, "start_dt": {"$gt": d}}).sort([('start_dt', pymongo.ASCENDING)]).limit(pageSize))
    return events


### publish event route 
@router.get("/published", response_description="Get all published events", response_model=List[EventInDB])
def list_published_events(request: Request):
    events = list(request.app.database["events"].find({"published": True}))
    return events

### get unpublished route
@router.get("/unpublished", response_description="Get all unpublished events", response_model=List[EventInDB])
def list_unpublished_events(request: Request):
    events = list(request.app.database["events"].find({"published": False}))
    return events

@router.post("/publish/{id}", response_description="Publish Event", response_model=EventInDB)
async def publish_event(id: str, request: Request, user:User=Depends(get_current_user)):
    

    if (
        existing_event := request.app.database["events"].find_one({"_id": id})
        
    ) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Event with ID {id} not found")
    
    if existing_event["host_id"] != user["_id"]:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail=f"Only the owner of this event can edit it")
    
    existing_event['published'] = True
    
    updated_event = request.app.database["events"].find_one_and_update(
            {"_id": id}, {"$set": existing_event}, return_document=ReturnDocument.AFTER
    )
    # send email when the event has been published
    event_publish(request, existing_event['_id'], user["_id"])
    return updated_event
    
    
    
@router.post("/unpublish/{id}", response_description="Unpublish Event", response_model=EventInDB)
def unpublish_event(id: str, request: Request, user:User=Depends(get_current_user)):
    if (
        existing_event := request.app.database["events"].find_one({"_id": id})
        
    ) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Event with ID {id} not found")
    
    if existing_event["host_id"] != user["_id"]:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail=f"Only the owner of this event can edit it")
    existing_event['published'] = False
    
    updated_event = request.app.database["events"].find_one_and_update(
            {"_id": id}, {"$set": existing_event}, return_document=ReturnDocument.AFTER
    )
    return updated_event


@router.post("/search", response_description="search", response_model=List[EventInDB])
def search_events(request: Request, filter: Filter):
    events_list = []
    if filter.fuzzy:
        # print("LLLLL")
        # address filter
        query = {"address": re.compile(filter.fuzzy, flags=re.IGNORECASE), "published": True}
        events_list.extend(list(request.app.database["events"].find(query)))
        # details filter
        query = {"details": re.compile(filter.fuzzy, flags=re.IGNORECASE), "published": True}
        events_list.extend(list(request.app.database["events"].find(query)))
        # title filter
        query = {"title": re.compile(filter.fuzzy, flags=re.IGNORECASE), "published": True}
        events_list.extend(list(request.app.database["events"].find(query)))

        events = []
        for i in events_list:
            if i not in events:
                events.append(i)
    else:
        events = list(request.app.database["events"].find({"published": True}))

    # category filter
    if filter.category:
        event_list = []
        for event in events:
            # for category in filter.category:
            #     if category:
            #         if event['category'] == category:
            if event['category'] in filter.category:
                event_list.append(event)
        events = event_list

    # distance filter
    if filter.user_postcode and filter.distance:
        event_list = []
        if float(filter.distance) != 100:
            for event in events:
                if distance_post(int(filter.user_postcode), int(event["postcode"])) < float(filter.distance):
                    event_list.append(event)
        else:
            for event in events:
                if distance_post(int(filter.user_postcode), int(event["postcode"])) >= float(filter.distance):
                    event_list.append(event)

        events = event_list

    # price filter
    if filter.price:
        event_list = []
        # print(event_list)
        for event in events:
            tickets = list(request.app.database["tickets"].find({"event_id": str(event["_id"])}))
            if tickets:
                cheapest = min(tickets, key = lambda  t: t['price'])['price']
            else:
                cheapest = math.inf
            if float(filter.price) != 100:
                if cheapest < float(filter.price):
                    event_list.append(event)
            else:
                if cheapest >= float(filter.price):
                    event_list.append(event)
        events = event_list
        # print(event_list)
    # datetime filter
    if filter.start_dt:
        event_list = []
        for event in events:
            event_start_dt = event['start_dt']
            if isinstance(event['start_dt'], str):
                event_start_dt = dateutil.parser.parse(event['start_dt'])
            if event_start_dt.timestamp() >= filter.start_dt.timestamp() :
                event_list.append(event)
        events = event_list


    if filter.end_dt:
        event_list = []
        for event in events:
            event_start_dt = event['start_dt']
            if isinstance(event['start_dt'], str):
                event_start_dt = dateutil.parser.parse(event['start_dt'])
            if event_start_dt.timestamp() <= filter.end_dt.timestamp():
                event_list.append(event)
        events = event_list

    return events


@router.get("/{id}", response_description="Get a single event by id", response_model=EventInDB)
def find_event(id: str, request: Request):
    if (event := request.app.database["events"].find_one({"_id": id})) is not None:
        return event
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"event with ID {id} not found")


@router.put("/{id}", response_description="Update an event", response_model=EventInDB)
async def update_event(id: str, request: Request, event: EventUpdate, user: User = Depends(get_current_user)):
    # event['start_dt'] = event['start_dt'].split("+")[0]
    # event['end_dt'] = event['end_dt'].split("+")[0]
    if (
            existing_event := request.app.database["events"].find_one({"_id": id})
    ) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Event with ID {id} not found")

    if existing_event["host_id"] != user["_id"]:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail=f"Only the owner of this event can edit it")

    event = {k: v for k, v in event.dict().items() if v is not None}

    if len(event) >= 1:
        updated_result = request.app.database["events"].find_one_and_update(
            {"_id": id}, {"$set": event}, return_document=ReturnDocument.AFTER
        )
        # send email
        event_update_notice(request, id)
        return updated_result
    return existing_event


@router.delete("/{id}", response_description="Delete a user")
def delete_event(id: str, request: Request, response: Response, user: User = Depends(get_current_user)):
    if (
            found_event := request.app.database["events"].find_one({"_id": id})
    ) is not None:
        if found_event["host_id"] != user["_id"]:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail=f"Only the owner of this event can delete this")
        delete_result = request.app.database["events"].delete_one({"_id": id})
        if delete_result.deleted_count == 1:
            response.status_code = status.HTTP_204_NO_CONTENT
            return response

    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Event with ID {id} not found")
    
# @router.delete("/purge", response_description="Delete a user")
# async def delete_event(to_keep: List[str], request: Request):
#     events = request.app.database["events"].find()

#     for event in events:
#         print(event)
#         if event["_id"] not in to_keep:
#             print("this is to be deleted")
#             delete_result = request.app.database["events"].delete_one({"_id": event['_id']}) 
#     return to_keep


@router.post("/seats/{id}", response_description="Add seating plan to event", status_code=status.HTTP_201_CREATED, response_model=SeatPlanInDB)
def add_seat_plan(id: str, seat_plan:SeatPlan, request: Request, user: User = Depends(get_current_user)):
    if (
            found_event := request.app.database["events"].find_one({"_id": id})
            
    ) is not None:
        if found_event["host_id"] != user["_id"]:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail=f"Only the owner of this event can add a seating plan")
        if found_event['published'] == True:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                detail=f"You cannot add a seat plan to an already published event")
    seat_plan = jsonable_encoder(seat_plan)
    seat_plan['event_id'] = id
    new_plan = request.app.database["seat_plan"].insert_one(seat_plan)
    created_plan = request.app.database["seat_plan"].find_one(
        {"_id": new_plan.inserted_id}
    )
    
    found_event["seat_plan"] = new_plan.inserted_id
    
    request.app.database["events"].find_one_and_update(
            {"_id": id}, {"$set": found_event}, return_document=ReturnDocument.AFTER
        )
    
    return created_plan
    
@router.get("/seats/{id}", response_description="Add seating plan to event", status_code=status.HTTP_201_CREATED, response_model=SeatPlanInDB)
def get_seat_plan(id: str, request: Request):
    if (
            found_event := request.app.database["events"].find_one({"_id": id})
            
    ) is not None:
        if 'seat_plan' not in found_event:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail=f"This event does not have a seat plan")
                                
    found_plan = request.app.database["seat_plan"].find_one(
        {"_id": found_event['seat_plan']}
    )
    
    if found_plan is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail=f"This seat plan no longer exists")
    
    return found_plan
    
@router.put("/seats/{id}", response_description="Add seating plan to event", status_code=status.HTTP_201_CREATED, response_model=SeatPlanInDB)
def update_seat_plan(id: str, seat_plan:SeatPlanUpdate, request: Request, user: User = Depends(get_current_user)):
    if (
            found_event := request.app.database["events"].find_one({"_id": id})
            
    ) is not None:
        if found_event["host_id"] != user["_id"]:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail=f"Only the owner of this event can add a seating plan")
        if found_event['published'] == True:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                detail=f"You cannot add a seat plan to an already published event")
    
        if 'seat_plan' not in found_event or found_event['seat_plan'] == "":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"This event does not have a seat plan to update")
    
    seat_plan = jsonable_encoder(seat_plan)
    seat_plan['event_id'] = id
    updated_plan = request.app.database["seat_plan"].find_one_and_update(
        {"_id": found_event['seat_plan']}, {"$set": seat_plan}, return_document=ReturnDocument.AFTER
    )
    return updated_plan
    
@router.get("/report/{event_id}", response_description="Get user's report", response_model=Report)
def Event_Report(event_id:str, request: Request):
    gender = {'male':0,'female':0,'nonbinary':0}
    age = {'<=14':0,'15-25':0,'26-35':0,'36-50':0,'>50':0}
    post = dict()
    output = {'gender':gender, 'age':age, 'post': post}
    userDB = list(request.app.database['users'].find({}))
    passes = list(request.app.database['passes'].find({"event_id":event_id, "status": "active"}))
    eventGoers = set(map(lambda x: x['user_id'], passes))
    eventGoers = list(filter(lambda x: x['_id'] in eventGoers, userDB))
    for goer in eventGoers:
        if goer['gender'] in gender:
            gender[goer['gender']] += 1 
        if goer['age'] in age:
            age[goer['age']] += 1 
        if goer['postcode'] in post:
            post[goer['postcode']] += 1 
        else:
            post[goer['postcode']] = 1 
    return output

@router.post("/cancel/{id}", response_description="Cancel the event", status_code=status.HTTP_202_ACCEPTED)
def cancel_event(id: str, request: Request, user: User = Depends(get_current_user)):
    if (
            found_event := request.app.database["events"].find_one({"_id": id})
            
    ) is not None:
        if found_event["host_id"] != user["_id"]:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail=f"Only the owner of this event cancel it")
    
        #get all tickets with this event id 
        tickets = list(request.app.database["passes"].find({"event_id":id}))
        
        #filter out previously refunded 
        tickets = list(filter(lambda booking: booking["status"] == "active", tickets))  
        
        payment_intents = set()
        for ticket in tickets: 
            if 'payment_intent' in ticket:
                payment_intents.add(ticket['payment_intent'])
          
        print(payment_intents)
        for payment_intent in payment_intents:
          try: 
            refund = stripe.Refund.create(
              payment_intent=payment_intent,
            )
          except stripe.error.StripeError as e:
           raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                              detail=e.user_message)
        
        request.app.database["passes"].update_many({"event_id": id, "status": "active"}, {"$set":{"status": "cancelled"}})
        request.app.database["events"].update_one({"_id": id}, {"$set":{"seat_plan":"", "tickets":[], "published":False}})
        updated_event = request.app.database["events"].find_one({"_id": id})
        return updated_event



@router.get("/testPublishEventSendEmail/")
async def hello(request: Request, id: str, user: str):
    await event_publish(request, id, user)
