# TicketPlanet.com 

TicketPlanet is a comprehensive event booking platform featuring interfaces for hosts to manage events, including ticketing and seat selection, email communication with booked users, and user-friendly browsing and search functionalities.

![image10](https://github.com/Yuanda-Dong/TicketPlanet/assets/37124273/45300b08-1f3d-4c01-b282-714160882aa1)

# Quick Start

## Front End

- In the `client` directory `npm start` runs the app in the development mode.

- You can access the website hosted on https://gorgeous-sprite-cf6d19.netlify.app/ once the railway server is turned on.

## Backend
✨ Features Python, FastAPI, PyMongo, MongoDB

### Environment Set Up
- create a Python3 virtual environment in `backend`
- Install Python requirements `pip install -r requirements.txt`

### Run FastAPI Server Locally 
- Change line 8 in app.py to a running MongoDb server. 
- run `python -m uvicorn main:app --reload` in `backend`

### Testing Stripe & Stripe Webhooks Locally
- Start up the backend server on (http://localhost:8000/)
- Download stripe CLI from (https://github.com/stripe/stripe-cli)
- Forward events to the webhook using `stripe listen --forward-to localhost:8000/payment/webhook`
- Update `backend/routes/payment.py` with system generated webhook password

#### Simulating Events
- You can simulate events using `stripe trigger <event>` e.g. `stripe trigger payment_intent.succeeded`
    
#### Session Checkout 
- Use the following details to complete a test Checkout 
  - Enter `4242 4242 4242 4242` as the card number
  - Enter any future date for card expiry
  - Enter any 3-digit number for CVV
  - Enter any billing postal code (`90210`)
