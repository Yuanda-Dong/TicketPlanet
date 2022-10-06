import uuid
from typing import Optional
from enum import Enum
from pydantic import BaseModel, Field, validator, ValidationError

class GenderEnum(str, Enum):
    male = 'male'
    female = 'female'
    nonbinary = 'nonbinary'

class User(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    email: str = Field(...)
    gender: GenderEnum = Field(...)
    postcode: int = Field(...)
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
                "email": "jane.doe@icloud.com",
                "gender": "nonbinary",
                "postcode": "2000"
            }
        }