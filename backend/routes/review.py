import re
from datetime import datetime
# from datetime import datetime
from typing import List

from bson import ObjectId
from fastapi import APIRouter, Body, Request, Response, HTTPException, status, Depends
from fastapi.encoders import jsonable_encoder
from pymongo import ReturnDocument
from models.review import Review, ReviewResponse, UpdateReview
from models.user import User
from util.oAuth import get_current_user

router = APIRouter()

@router.get("/", response_description="Get event comments", response_model=List[ReviewResponse])
def list_reviews(request: Request, id: str):
    reviews = list(request.app.database["reviews"].find({"event_id": id}))
    #print(reviews)
    for review in reviews:
        user = {"_id": review["user_id"]}
        review["id"] = str(review["_id"])
        user_object = request.app.database["users"].find_one(user)
        review["username"] = user_object["first_name"] + " " + user_object["last_name"] 
        if review["reply_review_id"]:
            user_id = request.app.database["reviews"].find_one({"_id": review["reply_review_id"]})["user_id"]
            user={"_id": user_id}
            user_object = request.app.database["users"].find_one(user)
            review["reply_username"] = user_object["first_name"] + " " + user_object["last_name"] 

    return reviews


@router.post("/")
def new_review(request: Request, review: Review = Body()):
    query = {
        "event_id": review.event_id,
        "user_id": review.user_id,
        "message": review.message,
        "parent_id": review.parent_id,
        "reply_review_id": review.reply_review_id,
        "createdAt": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    }

    request.app.database["reviews"].insert_one(query)
    return "success"


@router.delete("/")
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


@router.put("/")
def update_event( request: Request, updates: UpdateReview = Body()):
    myquery = { "_id": ObjectId(updates.id) }
    newvalues = { "$set": { "message": updates.message } }
    request.app.database["reviews"].update_one(myquery, newvalues)

def fmt_date(date: str):
    return datetime.strptime(date, "%Y-%m-%d %H:%M:%S")