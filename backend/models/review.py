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
    last_update_date: datetime = datetime.now()
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