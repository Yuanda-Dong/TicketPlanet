import Navbar from '../../components/Navbar/NavBar';
import PaymentForm from '../../components/PaymentForm/PaymentForm';
import './Payment.css';
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(
  'pk_test_51LplrMEHt2rYmWMjSn2QxFV529CtYWqLfN26Xpj8QLcZaOBKfxeg6YYGMDhg3TX2mYRm7SR0JK9vtLD9nbYR4x1R00gJqzzD6E'
);

export default function Payment() {
  const [clientSecret, setClientSecret] = useState('');

  // useEffect(() => {
  //     // Create PaymentIntent as soon as the page loads
  //     fetch("/create-payment-intent", {
  //         method: "POST",
  //         headers: {"Content-Type": "application/json"},
  //         body: JSON.stringify({items: [{id: "xl-tshirt"}]}),
  //     })
  //         .then((res) => res.json())
  //         .then((data) => setClientSecret(data.clientSecret));
  // }, []);

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <>
      <Navbar />
      <div className="Pay">
        {clientSecret && (
          <Elements options={options} stripe={stripePromise}>
            <PaymentForm />
          </Elements>
        )}
      </div>
    </>
  );
}
