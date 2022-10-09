from fastapi import APIRouter, Body, Request, Response, HTTPException, status, Depends
from fastapi.encoders import jsonable_encoder
from typing import List
from util.oAuth import oauth2_scheme
from util.app import app
import sys

from models.user import User, UserUpdate

router = APIRouter()


## Oauth Management

def decode_token(token):
    return User(
         username=token + "fakedecoded", email="john@example.com", full_name="John Doe"
    )
    
async def get_current_user(token: str = Depends(oauth2_scheme)):
    user = decode_token(token)
    return user

############
# Utility Functions

async def get_user_email(email: str, request:Request):
    found_user = request.app.database["users"].find_one({"email":email})
    return found_user


#####

#Routes

@router.get("/user/me")
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/user", response_description="Create a new user", status_code=status.HTTP_201_CREATED, response_model=User)
def create_user(request: Request, user: User = Body(...)):
    user = jsonable_encoder(user)
    new_user = request.app.database["users"].insert_one(user)
    created_user = request.app.database["users"].find_one(
        {"_id": new_user.inserted_id}
    )

    return created_user
    
@router.get("/user", response_description="Get all users", response_model=List[User])
def list_users(request: Request, token: str = Depends(oauth2_scheme)):
    users = list(request.app.database["users"].find(limit=100))
    return users
    
@router.get("/user/{id}", response_description="Get a single user by id", response_model=User)
def find_user(id: str, request: Request):
    if (user := request.app.database["users"].find_one({"_id": id})) is not None:
        return user
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"user with ID {id} not found")
    
@router.put("/user/{id}", response_description="Update a user", response_model=User)
def update_user(id: str, request: Request, user: UserUpdate = Body(...)):
    user = {k: v for k, v in user.dict().items() if v is not None}
    if len(user) >= 1:
        update_result = request.app.database["users"].update_one(
            {"_id": id}, {"$set": user}
        )

        if update_result.modified_count == 0:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User with ID {id} not found")

    if (
        existing_user := request.app.database["users"].find_one({"_id": id})
    ) is not None:
        return existing_user

    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User with ID {id} not found")
    
@router.delete("/user/{id}", response_description="Delete a user")
def delete_user(id: str, request: Request, response: Response):
    delete_result = request.app.database["users"].delete_one({"_id": id})

    if delete_result.deleted_count == 1:
        response.status_code = status.HTTP_204_NO_CONTENT
        return response

    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User with ID {id} not found")