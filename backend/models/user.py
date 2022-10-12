import uuid
from typing import Optional, Union
from enum import Enum
from pydantic import BaseModel, Field, validator, ValidationError
from util.oAuth import oauth2_scheme


class GenderEnum(str, Enum):
    male = 'male'
    female = 'female'
    nonbinary = 'nonbinary'

class AgeEnum(str, Enum):
    age_group1 = '<= 14 years'
    age_group2 = '15 - 25 years'
    age_group3 = '26 - 35 years'
    age_group4 = '36 - 50 years'
    age_group5 = '> 50 years'


class User(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    email:str = Field(...)
    first_name:str = Field(...)
    last_name:str = Field(...)
    gender: GenderEnum = Field(...)
    postcode: int = Field(...)
    disabled: Union[bool, None] = None
    age: AgeEnum = Field(...)
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
                "first_name": "Don",
                "last_name" : "Quixote",
                "gender": "nonbinary",
                "postcode": "2000",
                "disabled:": "true",
                "age": "15 - 25 years"
            }
        }
        
class UserInDB(User):
    password: str = Field(...)
    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "email": "Don.Quixote@gmail.com",
                "first_name": "Don",
                "last_name" : "Quixote",
                "gender": "nonbinary",
                "postcode": "2000",
                "disabled:": "true",
                "password": "password",
                "age": "15 - 25 years"
            }
        }

class UserUpdate(BaseModel):
    id: Optional[str]
    email: Optional[str]
    gender: Optional[GenderEnum]
    postcode: Optional[int]
    age: Optional[AgeEnum]
    
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
                "first_name": "Don",
                "last_name" : "Quixote",
                "gender": "nonbinary",
                "postcode": "2000",
                "age": "15 - 25 years"
            }
        }


class ForgetPassword(BaseModel):
    email: Optional[str]

class ResetPassword(BaseModel):
    reset_password_token: Optional[str]
    new_password: str
    confirm_password: str