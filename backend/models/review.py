# from datetime import datetime
from datetime import datetime
import uuid
from typing import Optional, List
from pydantic import BaseModel,Field
from typing import Optional, List, Dict



class Review(BaseModel): #use to get from frontend, and store in DB
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    message: str
    parent_id: Optional[str]  # base review: None, replies: id of base review
    reply_review_id: Optional[str]  #review id of reviews it replies to
    created_date: datetime = datetime.now()
    #reply_userId: Optional(str) # userId of the review replies to

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            # base review by Mike
            "example": {
                "message": "This is some review",
                "parent_id": "",
                "reply_review_id": ""
            }
        }
class ReviewInDB(Review):
    user_id: str
    event_id: str


class ReviewResponse(ReviewInDB): #use to send back to frontend
    username: str
    replying_to_user: Optional[str]

# @router.put('/{reviewId}')
class UpdateReview(BaseModel): #use to update reviews in DB
    message: str #updated message
    createdAt: datetime


# @router.delete("/{reviewId}")
# delete a review using reviewId





    
# class Reply(BaseModel):
#     id: str = Field(default_factory=uuid.uuid4, alias="_id")
#     base_comment: str
#     reply_to: str #userId --> backend get username
#     #reply_preview: str #first 50 characters
#     message: str 
#     user_id: str

#     class Config:
#         allow_population_by_field_name = True
#         schema_extra = {
#             "example": {
#                 "id": "12345",
#                 "base_comment": "this is base comment",
#                 "reply_to": "11111",
#                 "message": "this is a reply message",
#                 "user_id":"22222"
#             }
#         }


# class BaseComment(BaseModel):
#     id: str = Field(default_factory=uuid.uuid4, alias="_id")
#     message: str 
#     user_id: str
#     replies: List[Reply]
    
#     class Config:
#         allow_population_by_field_name = True
#         schema_extra = {
#             "example": {
#                 "id": "12345",
#                 "message": "this is a reply message",
#                 "user_id": "22222",
#                 "replies": ["this is a reply message"]
#             }
#         }
        

# class ReplyInDB(Reply):
#     username: str
#     reply_username: str
#     date: datetime

#     class Config:
#         allow_population_by_field_name = True
#         schema_extra = {
#             "example": {
#                 "username": "naixin",
#                 "reply_username":"dylan",
#                 "date": "2022-10-11T12:55",
#                 "user": "12345",
#                 "message": "this is a reply message",
#                 "user_id": "22222",
#                 "replies": []
#             }
#         }
    
# class BaseCommentInDB(BaseComment):
#    username: str
#    date: datetime

#    class Config:
#        allow_population_by_field_name = True
#        schema_extra = {
#            "example": {
#                "username": "serena",
#                "date": "2022-10-11T12:55",
#                "id": "12345",
#                "message": "this is a reply message",
#                "user_id": "22222",
#                "replies": ["this is a reply message"]
#            }
#        }