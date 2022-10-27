from datetime import datetime
import re
# from datetime import datetime
from typing import List

from bson import ObjectId
from fastapi import APIRouter, Body, Depends, HTTPException, Request, status
from fastapi.encoders import jsonable_encoder
from pymongo import ReturnDocument
from models.review import Review, ReviewResponse, ReviewInDB, UpdateReview
from models.user import User
from util.oAuth import get_current_user

router = APIRouter()

@router.get("/", response_description="Get event comments", response_model=List[ReviewResponse])
def list_reviews(request: Request, id: str):
    reviews = list(request.app.database["reviews"].find({"event_id": id}))
    #print(reviews)
    for review in reviews:
        # print(review)
        user = request.app.database["users"].find_one({"_id": review["user_id"]})
        replying_to = None if review["reply_review_id"] is None else request.app.database["reviews"].find_one({"_id": review["reply_review_id"]}) 
        review["username"] = user["first_name"] + " " + user["last_name"]
        replying_to_user = None if replying_to is None else request.app.database["users"].find_one({"_id": replying_to["user_id"]})
        review["replying_to_user"] = "" if replying_to is None else replying_to_user["first_name"] + " " + replying_to_user["last_name"]
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


@router.put("/{review_id}", response_model=ReviewInDB)
def update_event(review_id:str, request: Request, updated_review: UpdateReview, user: User = Depends(get_current_user)):
    if (
            existing_review := request.app.database["reviews"].find_one({"_id": review_id})
    ) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"review with ID {review_id} not found")
        
    if existing_review["user_id"] != user["_id"]:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail=f"Only the owner of this review can edit it")
    updated_review = jsonable_encoder(updated_review)  
    updated_review["last_update_date"] = datetime.now()  
        
    updated_review = request.app.database["reviews"].find_one_and_update(
        {"_id": review_id}, {"$set": updated_review}, return_document=ReturnDocument.AFTER
    )
    return updated_review
