# from fastapi import FastAPI
from util.app import app
from routes.user import router as user_router
from routes.event import router as event_router
from routes.ticket import router as ticket_router
from routes.review import router as review_router
from routes.payment import router as payment_router
# from uvicorn import run

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
app.include_router(event_router, tags=["events"], prefix="/event")
app.include_router(ticket_router, tags=["tickets"], prefix="/ticket")
app.include_router(review_router, tags=["reviews"], prefix="/review")
app.include_router(payment_router, tags=["payments"], prefix="/payment")

# if __name__ == '__main__':
#     run('main:app', reload=True, port=8082)