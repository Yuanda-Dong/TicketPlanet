# TicketPlanet.com 
![image10](https://github.com/Yuanda-Dong/TicketPlanet/assets/37124273/45300b08-1f3d-4c01-b282-714160882aa1)

# Front End

`cd client`
## Running on Local Server

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run production`

Runs the app in the production mode with production API.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Accessing Live Website

You can access the website hosted on https://gorgeous-sprite-cf6d19.netlify.app/ once the railway server is turned on.



# Backend
`cd backend`

Our backend is implemented on [Railway](https://railway.app) using a [FastAPI](https://fastapi.tiangolo.com/) app server supported by [PyMongo](https://pymongo.readthedocs.io/en/stable/) on a [MongoDB](https://www.mongodb.com/) DB. 

You can find an existing deployed backend here (https://comp9900-production.up.railway.app/docs)

## ✨ Features

- Python
- FastAPI
- PyMongo
- MongoDB

## 💁‍♀️ How to use
### Environment Set Up
- (Optional) create a Python3 virtual environment in your desired backend location `virtualenv path/to/directory'
- Clone repo into the environment folder
- Sign up to [Railway](https://railway.app) using your github 
- Install the [Railway CLI](https://docs.railway.app/develop/cli) on your OS
- Link the Project - you can find this link on the project page in Railway under 'Set up your project locally'
    - Use `railway link <project-link>` in your command line to link it 
- Install Python requirements `pip install -r requirements.txt`

### Run FastAPI Server Locally 
- Make sure you are in the backend folder not the project folder
- To run the server locally but still access the railway DB you need to use the
  command: `railway run python -m uvicorn main:app --reload`
- Go to (http://localhost:8000/docs)

### Deploy to Railway
- Change directory to project source
- Use `railway up` to deploy it
    - !!! Make sure to remove the deployment on railway after you are done to save credits !!! 
        - Click on the COMP9900 deployment in Railway 
        - Under the Deployments sub-heading, click the 3-dots symbol next to the deployed app 
        - Click 'Remove Deployment' 

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
