import json
from fastapi.encoders import jsonable_encoder
from fastapi import APIRouter, Body, Request, Response, HTTPException, status, Depends
import stripe
import os

stripe.api_key = os.getenv("STRIPE_API_KEY")
webhook_secret = 'whsec_49b15278a690057b4d5fcd818a85d9e1db99a3ede387e8dee41b70f5c15ab41e' #os.getenv("STRIPE_WEBHOOK") ### <--- update here to stripe cli key if you're testing locally
router = APIRouter()
###
# Payment Flow
# Intent -> this will create a payment intent with the quantity and amount of tickets to be purchased
#           -> lock the pontential tickets 
#           -> create deactivated physical tickets & link to payment object
#           -> return payment object
# Payment -> user/card details 
#          -> if (cancel) -> release locked tickets, delete physical tickets, close payment intent
#          -> 
###




@router.post('/webhook')
async def webhook(request: Request):
   
    event = None
    payload = await request.body()
    print(request.headers)
    sig_header = request.headers['stripe-signature']

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, webhook_secret
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail=e.message)
    except stripe.error.SignatureVerificationError as e:
         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=e.user_message)

    # Handle the event
    if event['type'] == 'payment_intent.amount_capturable_updated':
      payment_intent = event['data']['object']
    elif event['type'] == 'payment_intent.canceled':
      payment_intent = event['data']['object']
    elif event['type'] == 'payment_intent.created':
        print('this actually worked')
        payment_intent = event['data']['object']
        print(payment_intent)
    elif event['type'] == 'payment_intent.partially_funded':
      payment_intent = event['data']['object']
    elif event['type'] == 'payment_intent.payment_failed':
      payment_intent = event['data']['object']
    elif event['type'] == 'payment_intent.processing':
      payment_intent = event['data']['object']
    elif event['type'] == 'payment_intent.requires_action':
      payment_intent = event['data']['object']
    elif event['type'] == 'payment_intent.succeeded':
      payment_intent = event['data']['object']
    elif event['type'] == 'payment_intent.succeeded':
      payment_intent = event['data']['object']
    elif event['type'] == 'checkout_session.completed':
      session = event['data']['object']
      
      
    # ... handle other event types
    else:
      print('Unhandled event type {}'.format(event['type']))

    return {'success':True}