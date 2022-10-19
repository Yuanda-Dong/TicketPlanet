from datetime import datetime
import uuid
from typing import Optional, List, Dict
from enum import Enum
from pydantic import BaseModel, Field, validator



class PaymentStatus(str, Enum):
    not_paid = 'not paid'
    paid = 'paid'
    refunded = 'refunded'
    partial_refund = "partial_refund"
    cancelled = 'cancelled'

class Payment(BaseModel):
    id: str = Field(alias="_id") #this will correspond to stripe paymentintent
    base_ticket:str = Field(...)
    user_id: str = Field(...)
    amount: float = Field(...)
    quantity:int = Field(...)
    stauts: PaymentStatus = 'not paid'
    tickets: List[str] = []
    @validator('quantity')
    def quant_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError('Quantity must be positive')
        return v
    
    @validator('amount')
    def amount_minimum(cls, v):
        if v < 0.5:
            raise ValueError('Quantity must be positive')
        return v
                
class PaymentUpdate(BaseModel):
    id: Optional[str] 
    base_ticket:Optional[str] 
    user_id: Optional[str] 
    amount: Optional[float] 
    quantity:Optional[int] 
    stauts: Optional[PaymentStatus]
    tickets: Optional[List[str]]
    @validator('quantity')
    def quant_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError('Quantity must be positive')
        return v
    
    @validator('amount')
    def amount_minimum(cls, v):
        if v < 0.5:
            raise ValueError('Quantity must be positive')
        return v

