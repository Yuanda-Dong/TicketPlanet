from datetime import datetime
import uuid
from typing import Optional, List, Dict, Tuple
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
    images: Optional[List[str]]

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "name": "General Admission",
                "description": "The Wiggles are the premier Australian Rockband"
            }
        }
    

class PriceData(BaseModel):
    currency: str = 'aud'
    product_data: ProductData
    # unit_amount: int #remember this is in cents
    # @validator('unit_amount')
    # def price_floor(cls, v):
    #     if v < 20:
    #         raise ValueError('minimum price is 20c')
    #     return v
    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "currency": "aud",
                "unit_amount": 1500
            }
        }
    
class PaymentMode(str, Enum):
    payment='payment'
    
class LineItems(BaseModel):
    price_data: PriceData
    quantity: int
    @validator('quantity')
    def quant_must_be_positive(cls, v):
        if v < 1:
            raise ValueError('quantity must be positive')
        return v

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "quantity": 1
            }
        }
    
    
class MetaData(BaseModel):
    seats: List[Tuple[int, int]] = []
    seat_ids: List[str] = []
class TicketPaymentSession(BaseModel):
    cancel_url: str
    success_url: str
    mode: str
    customer_email: str
    line_items: List[LineItems]
    metadata: MetaData

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "cancel_url": "http://localhost:8000/docs/",
                "success_url": "http://localhost:8000/docs/",
                "mode": "payment",
                "customer_email": "dylan.oldfield@yahoo.com",
                "line_items": [
                    {
                        'quantity': 3,
                        'price_data': {
                            'currency': 'aud',
                            # 'unit_amount': 1500,
                            'product_data':{
                                'name': 'General Admission',
                                'description': "The Wiggles are the premier Australian Rockband"
                            }
                        
                        }
                    } 
                ],
                "metadata":{
                    "seats": [(0,0), (0,1), (0,2)]
                }
            }
        }

class TicketSessionReturn(TicketPaymentSession):
    id: str

class PaymentIntentReturn(BaseModel):
    clientSecret: str
    #tickets: List[str] = []
    
class TicketPaymentIntent(BaseModel):
    amount: int
    currency: str = 'aud'
    payment_method_types: List[str] = ['card']
    metadata: TicketPayment

class SeatRefunds(BaseModel):
    seats_to_refund: List[str] = []
