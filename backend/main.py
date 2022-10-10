# from fastapi import FastAPI
from util.app import app
from routes.user import router as user_router
from uvicorn import run

@app.get("/")
async def root():
    return {"message": "welcome to the server, how may I assist you!"}
    
@app.on_event("startup")
def startup_db_client():
    print("Connected to the MongoDB database!")

@app.on_event("shutdown")
def shutdown_db_client():
    app.mongodb_client.close()

app.include_router(user_router, tags=["users"], prefix="/user")

if __name__ == '__main__':
    run('main:app', reload=True, port=8082)