from fastapi import APIRouter, Body, Request, Response, HTTPException, status, Depends
from fastapi.encoders import jsonable_encoder
from util.send_email import password_reset, reset_template
import uuid
from fastapi.security import  OAuth2PasswordRequestForm
from typing import List, Union
from util.oAuth import  authenticate_user, get_password_hash, create_access_token, get_current_user #,oauth
from util.app import app
from datetime import datetime, timedelta
import os
from starlette.responses import HTMLResponse, RedirectResponse
from authlib.integrations.starlette_client import OAuthError
from pymongo import ReturnDocument
from models.user import User, UserUpdate, UserInDB, ForgetPassword, ResetPassword
from models.token import Token, TokenData

import sys
sys.path.append("..models") # Adds higher directory to python modules path.

router = APIRouter()

    
@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    print(form_data.username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")))
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# @app.get('/google/login')
# async def login(request: Request):
#     redirect_uri = request.url_for('auth')
#     return await oauth.google.authorize_redirect(request, redirect_uri)


# @app.get('/google/auth')
# async def auth(request: Request):
#     try:
#         token = await oauth.google.authorize_access_token(request)
#     except OAuthError as error:
#         return HTMLResponse(f'<h1>{error.error}</h1>')
#     user = token.get('userinfo')
#     if user:
#         request.session['user'] = dict(user)
#     return RedirectResponse(url='/')


# @app.get('/google/logout')
# async def logout(request: Request):
#     request.session.pop('user', None)
#     return RedirectResponse(url='/')

#####

#Routes

@router.get("/me", response_model=User)
def whoami(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/", response_description="Create a new user", status_code=status.HTTP_201_CREATED, response_model=User)
def create_user(request: Request, user: UserInDB = Body(...)):
    user = jsonable_encoder(user)
    user["password"] = get_password_hash(user["password"])
    new_user = request.app.database["users"].insert_one(user)
    created_user = request.app.database["users"].find_one(
        {"_id": new_user.inserted_id}
    )
    return created_user

@router.get("/", response_description="Get all users", response_model=List[User])
def list_users(request: Request, user: User = Depends(get_current_user)):
    users = list(request.app.database["users"].find(limit=100))
    return users

@router.get("/{id}", response_description="Get a single user by id", response_model=User)
def find_user(id: str, request: Request, user: User = Depends(get_current_user)):
    if (user := request.app.database["users"].find_one({"_id": id})) is not None:
        return user
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"user with ID {id} not found")

@router.put("/{id}", response_description="Update a user", response_model=UserInDB, )
def update_user(id: str, request: Request, updates: UserUpdate, auth:User = Depends(get_current_user)):
    if auth["_id"] != id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Only the user can edit their details")
    updates = {k: v for k, v in updates.dict().items() if v is not None}
    if len(updates) >= 1:
        updated_result = request.app.database["users"].find_one_and_update({"_id": id}, {"$set": updates}, return_document=ReturnDocument.AFTER)
        return updated_result

    if (
        existing_user := request.app.database["users"].find_one({"_id": id})
    ) is not None:
        return existing_user

    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User with ID {id} not found")

@router.delete("/{id}", response_description="Delete a user")
def delete_user(id: str, request: Request, response: Response, user: User = Depends(get_current_user)):
    delete_result = request.app.database["users"].delete_one({"_id": id})

    if delete_result.deleted_count == 1:
        response.status_code = status.HTTP_204_NO_CONTENT
        return response

    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User with ID {id} not found")



@router.post("/forgot-password")
async def forgot_password(request: Request, email: ForgetPassword):
    email = email.email
    # Check User existed
    user = request.app.database["users"].find_one({"email": email})
    # check reset-code
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Your email was not found")

    # Create reset code and save in database
    reset_code = str(uuid.uuid1())
    # get current date and time
    now = datetime.now()
    timestamp = datetime.timestamp(now)
    # create all the information about reset code in database
    reset_code_dic = {
            "time": timestamp,
            "code": reset_code,
            "email": email,
            "fail count": 3,
            "status": "unfinished"
    }
    reset_code_result = request.app.database["forgot_pwd"].insert_one(reset_code_dic)

    # sending email
    subject = "Hello Coder"
    recipient = [email]
    message = reset_template.format(email, reset_code)
    # try:
    await password_reset(subject, recipient, message)
    # except:
    #     raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
    #                         detail="reset password token has expired, please request a new one")
    return {
        "reset_code": reset_code,
        "code":200,
        "message": "We've sent an email with instruction to reset your password"
    }

@router.post("/reset-password")
# async def reset_password(request: Request, reset_password_token: str, new_password: str, confirm_password: str):
async def reset_password(request: Request, body : ResetPassword):
    reset_password_token = body.reset_password_token
    new_password = body.new_password
    confirm_password=body.confirm_password
    # Check valid reset password token
    reset_token = request.app.database["forgot_pwd"].find_one({"code": reset_password_token})
    print(reset_token["status"])
    if reset_token is None or reset_token["code"] != reset_password_token:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="reset password token has expired, please request a new one")
    if reset_token["status"] == "finished":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="reset password token has expired, please request a new one")
    # Cehck code time expired
    now = datetime.now()
    timestamp = datetime.timestamp(now)
    code_timestamp = reset_token["time"]
    if int(timestamp - code_timestamp) > 1*60*60: # 1 hours
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="reset password token has expired, please request a new one")

    # Check both new & confirm password are match
    if new_password != confirm_password:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="reset password token has expired, please request a new one")
    # Reset new password
    forgot_password_object = ForgetPassword(**reset_token)
    email = forgot_password_object.email
    new_hashed_password = get_password_hash(new_password)

    # Update password in db
    update_password = request.app.database["users"].update_one(
        {"email": email}, {"$set": {"password": new_hashed_password} }
    )

    # update the reset_token status in mongodb
    Disable_reset_code = request.app.database["forgot_pwd"].update_one( # delete_one
        {"code": reset_password_token}, {"$set": {"status": "finished"}}
    )

    return {
        "code": 200,
        "message": "Password has been reset successfully"
    }


# @router.post("/routes/check-code")
# async def reset_password(request: Request, reset_password_token: str):
#     # Check valid reset password token
#     reset_token = request.app.database["forgot_pwd"].find_one({"code": reset_password_token})
#     if reset_token is None or reset_token["code"] != reset_password_token or reset_token["status"] == "finished":
#         # raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="reset password token has expired, please request a new one")
#         return "**.html"  # guoqi
#   #    # Cehck code time expired
#     now = datetime.now()
#     timestamp = datetime.timestamp(now)
#     code_timestamp = reset_token["time"]
#     if int(timestamp - code_timestamp) > 1*60*60: #  1 hours
#         #raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="reset password token has expired, please request a new one")
#         return "guoqi.html"
#
#     return "shez.html"