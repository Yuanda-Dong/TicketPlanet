from fastapi import FastAPI
import os
from pymongo import MongoClient
from routes.user import router as user_router

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "welcome to the server, how may I assist you!"}
    
@app.on_event("startup")
def startup_db_client():
    app.mongodb_client = MongoClient(os.getenv("MONGO_URL"))
    app.database = app.mongodb_client['test']
    print("Connected to the MongoDB database!")

@app.on_event("shutdown")
def shutdown_db_client():
    app.mongodb_client.close()

app.include_router(user_router, tags=["users"], prefix="/user")