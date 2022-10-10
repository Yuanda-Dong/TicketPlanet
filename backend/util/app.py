from fastapi import FastAPI
import os
from pymongo import MongoClient
from starlette.middleware.sessions import SessionMiddleware

app = FastAPI()
app.mongodb_client = MongoClient(os.getenv("MONGO_URL"))
app.database = app.mongodb_client['test']
app.add_middleware(SessionMiddleware, secret_key=os.getenv("TOKEN_SECRET"))