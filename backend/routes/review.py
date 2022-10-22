from datetime import datetime
import re
# from datetime import datetime
from typing import List
from fastapi import APIRouter, Body, Depends, Request
from fastapi.encoders import jsonable_encoder
from models.review import Review, ReviewResponse, ReviewInDB, UpdateReview
from models.user import User
from util.oAuth import get_current_user

router = APIRouter()

@router.get("/", response_description="Get event comments", response_model=List[ReviewResponse])
def list_reviews(request: Request, id: str):
    reviews = list(request.app.database["reviews"].find({"event_id": id}))
    #print(reviews)
    for review in reviews:
        print(review)
        user = request.app.database["users"].find_one({"_id": review["user_id"]})
        replying_to = None if review["reply_review_id"] is None else request.app.database["users"].find_one({"_id": review["reply_review_id"]}) 
        review["username"] = user["first_name"] + " " + user["last_name"]
        review["replying_to_user"] = "" if replying_to is None else replying_to["first_name"] + " " + replying_to["last_name"]
    return reviews


@router.post("/{event_id}", response_description="Newly created Review", response_model=ReviewInDB)
def new_review(event_id:str,request: Request, review: Review, user: User = Depends(get_current_user)):
    review = jsonable_encoder(review)
    review["event_id"] = event_id
    review["user_id"] = user["_id"]
    new_review = request.app.database["reviews"].insert_one(review)
    created_review= request.app.database["reviews"].find_one(
        {"_id": new_review.inserted_id}
    )
    return created_review


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


# @router.put("/")
# def update_event( request: Request, updates: UpdateReview = Body()):
#     myquery = { "_id": ObjectId(updates.id) }
#     newvalues = { "$set": { "message": updates.message } }
#     request.app.database["reviews"].update_one(myquery, newvalues)

def fmt_date(date: str):
    return datetime.strptime(date, "%Y-%m-%d %H:%M:%S")