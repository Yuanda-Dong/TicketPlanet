import re
from datetime import datetime
# from datetime import datetime
from typing import List

from bson import ObjectId
from fastapi import APIRouter, Body, Request, Response, HTTPException, status, Depends
from fastapi.encoders import jsonable_encoder
from pymongo import ReturnDocument
from models.event import Event, EventInDB, EventUpdate
from models.review import ReviewResponse
from models.user import User
from util.oAuth import get_current_user

router = APIRouter()


@router.post("/", response_description="Create a new event", status_code=status.HTTP_201_CREATED,
             response_model=EventInDB)
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

@router.get("/upcoming", response_description="Get all events upcoming events", response_model=List[EventInDB])
def list_events(pageSize: int, pageNum: int, request: Request):
    events = list(request.app.database["events"].find(skip=pageNum*pageSize, limit=pageSize).sort([('start_dt', pymongo.ASCENDING)]))
    return events


@router.get("/search", response_description="search", response_model=List[EventInDB])
def search_events(request: Request, title="", descriptions="", start_dt="", end_dt="", category="", price="",
                  location1_postcode="", distance="", location=""):
    query = {}
    if len(title):
        query["title"] = re.compile(title)
    if len(descriptions):
        query["details"] = re.compile(descriptions)
    if len(location):
        query["address"] = re.compile(location)
    # if len(start_dt) and len(end_dt):
    #     query["start_dt"] = {"$lte": datetime.strptime(end_dt, "%Y-%m-%d %H:%M:%S")}
    #     query["end_dt"] = {"$gte": datetime.strptime(start_dt, "%Y-%m-%d %H:%M:%S")}
    if len(category):
        query["category"] = re.compile(category)
    events = list(request.app.database["events"].find(query))

    if len(price):
        event_list = []
        for event in events:
            ticket = request.app.database["tickets"].find_one({"event_id": str(event["_id"])})
            if ticket:
                if ticket['price'] < float(price):
                    event_list.append(event)
        events = event_list
                # events = list(filter(lambda event: request.app.database["tickets"].find_one({"event_id": str(event["_id"])})['price'] <
                #        float(price), events))

    if len(start_dt) and len(end_dt):
        event_list = []
        for event in events:
            print(event['end_dt'])
            event_end_dt = event['end_dt']
            if isinstance(event['end_dt'], str):
                event_end_dt = fmt_date(event['end_dt'])
            event_start_dt = event['start_dt']
            if isinstance(event['start_dt'], str):
                event_start_dt = event['start_dt']
            if (event_end_dt > fmt_date(start_dt)) and (event_start_dt < fmt_date(end_dt)):
                event_list.append(event)

        events = event_list
        #events = list(filter(lambda event: ((event['end_dt'] > fmt_date(start_dt)) and (event['start_dt'] <
        #                               fmt_date(end_dt))), events))

    if len(location1_postcode):
        events = list(
            filter(lambda event: abs(float(event["postcode"]) - float(location1_postcode)) <= float(distance),
                   events))
    #print(events)
    return events


@router.get("/review", response_description="Get event comments", response_model=List[ReviewResponse])
def list_reviews(request: Request, id: str):
    reviews = list(request.app.database["reviews"].find({"event_id": id}))
    #print(reviews)
    for review in reviews:
        user = {"_id": review["user_id"]}
        review["id"] = str(review["_id"])
        review["username"] = request.app.database["users"].find_one(user)["first_name"]
        if review["reply_review_id"]:
            reply = {"_id": review["reply_review_id"]}
            review["reply_username"] = request.app.database["users"].find_one(reply)["first_name"]

    return reviews


@router.post("/new/review")
def new_review(request: Request, event_id: str, user_id: str, message: str,
               parent_id=None, reply_review_id=None):
    query = {
        "event_id": event_id,
        "user_id": user_id,
        "message": message,
        "parent_id": parent_id,
        "reply_review_id": reply_review_id,
        "createdAt": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    }

    request.app.database["reviews"].insert_one(query)
    return "success"


@router.delete("/delete/review")
def delete_review(request: Request, id: str):
    reply_reviews = list(request.app.database["reviews"].find({"parent_id": id}))
    print(reply_reviews)
    if reply_reviews:
        for i in range(len(reply_reviews)):
            print(reply_reviews[i])
            prev_id= {"parent_id": str(dict(reply_reviews[i])["_id"])}
            reply_to_reply_reviews = list(request.app.database["reviews"].find(prev_id))
            #if reply_to_reply_reviews is not None:
            reply_reviews = reply_reviews + reply_to_reply_reviews

    for delete_review in reply_reviews:
        print(delete_review)
        request.app.database["reviews"].delete_one({"_id": dict(delete_review)["_id"]})

    request.app.database["reviews"].delete_one({"_id": ObjectId(id)})
    return "success"


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
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail=f"Only the owner of this event can edit it")

    event = {k: v for k, v in event.dict().items() if v is not None}

    if len(event) >= 1:
        updated_result = request.app.database["events"].find_one_and_update(
            {"_id": id}, {"$set": event}, return_document=ReturnDocument.AFTER
        )
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

@router.put("/update/review")
def update_event(id: str, request: Request, message: str):
    myquery = { "_id": ObjectId(id) }
    newvalues = { "$set": { "message": message } }
    request.app.database["reviews"].update_one(myquery, newvalues)

def fmt_date(date: str):
    return datetime.strptime(date, "%Y-%m-%d %H:%M:%S")
