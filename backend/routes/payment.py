from models.payment import Payment, PaymentStatus, PaymentUpdate
import stripe
import os

stripe.api_key = os.getenv("STRIPE_API_KEY")


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

def create_payment_intent():
    return