---
title: Railway Backend
description: This is the backend for our COMP9900 Project, enabled by Flask and Railway
tags:
  - python
  - flask
  - SQL Alchemy 
  - Railway
---

# COMP9900 Project Backend

Our backend is implemented on [Railway](https://railway.app) using a [FastAPI](https://fastapi.tiangolo.com/) app server supported by [PyMongo](https://pymongo.readthedocs.io/en/stable/) on a [MongoDB](https://www.mongodb.com/) DB. 

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
- Make sure you are in the  backend folder not the project folder
- To run the server locally but still access the railway DB you need to use the command: `railway run python -m uvicorn main:app --reload`
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
- Forward events to the webhook using `stripe listen --foward-to localhost:8000/payment/webhook`
- Update `backend/routes/payment.py` with system generated webhook password 

#### Simulating Events
- You can simulate events using `stripe trigger <event>` e.g. `stripe trigger payment_intent.succeeded`
    
#### Session Checkout 
- Use the following details to complete a test Checkout 
  - Enter `4242 4242 4242 4242` as the card number
  - Enter any future date for card expiry
  - Enter any 3-digit number for CVV
   -Enter any billing postal code (`90210`)