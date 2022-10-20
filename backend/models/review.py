# from datetime import datetime
from datetime import datetime
import uuid
from typing import Optional, List
from pydantic import BaseModel,Field
from typing import Optional, List, Dict



class Review(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    event_id: str
    user_id: str
    username: str # can be the first name of user
    message: str
    parent_id: Optional(str) # base review: None, replies: id of base review
    reply_message: Optional(str) # message the review replies to
    reply_username: Optional(str) # username the review replies to
    # createdAt: DateTime object created on server side

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "id": "review1",
                "event_id": "event1",
                "user_id":"user1",
                "username":"Mike",
                "message": "this is base review message by Mike",
                "parent_id": None,
                "reply_message": None,
                "reply_username":None,
            },
            "example":{
                "id": "review2",
                "event_id": "event1",
                "user_id":"user2",
                "username":"Jennie",
                "message": "this is reply review message by Jennie",
                "parent_id": "review1",
                "reply_message": "this is base review message by Mike",
                "reply_username":"Mike",
            }
        }


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