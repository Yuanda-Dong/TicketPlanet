
from typing import List
from fastapi import APIRouter, Body, Request, HTTPException, status, Depends
from models.ticket import  TicketInstance
from models.user import User
from util.oAuth import get_current_user

router = APIRouter()

@router.get('/payment', response_model=List[TicketInstance])
async def get_payment_intent_bookings(payment_intent:str, request: Request):           
    if(
      found_bookings := list(request.app.database["passes"].find({"payment_intent": payment_intent }))
    ) is not None: 
        for booking in found_bookings:
          booking['_id'] = str(booking["_id"])
        return found_bookings
    
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                      detail=f"no bookings exist with payment intent: {payment_intent}")

@router.get('/me', response_model=List[TicketInstance])
async def get_my_bookings(request: Request, user:User=Depends(get_current_user)):           
    if(
      found_bookings := list(request.app.database["passes"].find({"user_id": user['_id'] }))
    ) is not None: 
        for booking in found_bookings:
          booking['_id'] = str(booking["_id"])
        return found_bookings
    
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                      detail=f"no bookings exist for user: {user['_id']}")
                      

