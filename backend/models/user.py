import uuid
from typing import Optional, Union
from enum import Enum
from pydantic import BaseModel, Field, validator, ValidationError
from util.oAuth import oauth2_scheme
from fastapi import Depends

class GenderEnum(str, Enum):
    male = 'male'
    female = 'female'
    nonbinary = 'nonbinary'

class User(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    email: Union[str, None] = None
    first_name: Union[str, None] = None
    last_name: Union[str, None] = None
    gender: GenderEnum = Field(...)
    postcode: int = Field(...)
    disabled: Union[bool, None] = None
    # preferences
    
    @validator('postcode')
    def postcode_must_be_4_digts(cls, v):
        if len(str(v)) != 4:
            raise ValueError('Postcode must be 4 digits')
        return v

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "email": "Don.Quixote@gmail.com",
                "first name": "Don",
                "last name" : "Quixote",
                "gender": "nonbinary",
                "postcode": "2000"
            }
        }
        



class UserUpdate(BaseModel):
    id: Optional[str]
    email: Optional[str]
    gender: Optional[GenderEnum]
    postcode: Optional[int]
    
    @validator('postcode')
    def postcode_must_be_4_digts(cls, v):
        if len(str(v)) != 4:
            raise ValueError('Postcode must be 4 digits')
        return v

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "email": "Don.Quixote@gmail.com",
                "first name": "Don",
                "last name" : "Quixote",
                "gender": "nonbinary",
                "postcode": "2000"
            }
        }