from fastapi import APIRouter, Body, Request, Response, HTTPException, status, Depends
from fastapi.encoders import jsonable_encoder
from models.event import Event, EventInDB, EventUpdate
from models.user import User
from util.oAuth import get_current_user
from typing import List
from pymongo import ReturnDocument
from models.filter import Filter

router = APIRouter()

# start_date: Optional[datetime]
# end_date: Optional[datetime]
# reply_preview: str #first 50 characters
# category: Optional[List[str]]
# start_price: Optional[float]
# end_price: Optional[float]
# city: Optional[str]
#
# @router.get("/", response_description="Get some events by searching", response_model=List[FilterInDB])
# def search(request: Request):
#
#     events = list(request.app.database["events"].find(limit=100))
#     return events