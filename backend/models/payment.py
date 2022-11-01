from datetime import datetime
import uuid
from typing import Optional, List, Dict
from enum import Enum
from pydantic import AnyUrl, BaseModel, Field, validator



class PaymentStatus(str, Enum):
    not_paid = 'not paid'
    paid = 'paid'
    refunded = 'refunded'
    partial_refund = "partial_refund"
    cancelled = 'cancelled'



class TicketPayment(BaseModel):
    base_ticket:str = Field(...)
    user_id: str = Field(...)
    quantity:int = Field(...)
    seat:Optional[int]
    section: Optional[str]
    @validator('quantity')
    def quant_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError('Quantity must be positive')
        return v
    
                
# class PaymentUpdate(BaseModel):
#     id: Optional[str] 
#     base_ticket:Optional[str] 
#     user_id: Optional[str] 
#     amount: Optional[float] 
#     quantity:Optional[int] 
#     stauts: Optional[PaymentStatus]
#     tickets: Optional[List[str]]
#     @validator('quantity')
#     def quant_must_be_positive(cls, v):
#         if v <= 0:
#             raise ValueError('Quantity must be positive')
#         return v
    
#     @validator('amount')
#     def amount_minimum(cls, v):
#         if v < 0.5:
#             raise ValueError('Quantity must be positive')
#         return v



class ProductData(BaseModel):
    name: str 
    description: Optional[str]
    images: Optional[List[AnyUrl]]
    

class PriceData(BaseModel):
    currency: str = 'aud'
    product_data: ProductData
    unit_amount: int #remember this is in cents
    @validator('unit_amount')
    def price_floor(cls, v):
        if v < 20:
            raise ValueError('minimum price is 20c')
        return v
    
class PaymentMode(str, Enum):
    payment='payment'
    
class LineItems(BaseModel):
    price_data: PriceData
    quantity: int
    @validator('quant')
    def quant_must_be_positive(cls, v):
        if v < 1:
            raise ValueError('quantity must be positive')
        return v
    

class TicketPaymentSession(BaseModel):
    cancel_url: AnyUrl
    success_url: AnyUrl
    mode: PaymentMode
    customer_email: str

class PaymentIntentReturn(BaseModel):
    clientSecret: str
    #tickets: List[str] = []
    
class TicketPaymentIntent(BaseModel):
    amount: int
    currency: str = 'aud'
    payment_method_types: List[str] = ['card']
    metadata: TicketPayment

