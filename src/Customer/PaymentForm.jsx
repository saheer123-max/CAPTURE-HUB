import React, { useEffect, useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [clientSecret, setClientSecret] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [email, setEmail] = useState('');
  const [bookingId, setBookingId] = useState('');
  const [amount, setAmount] = useState('');

  const backendUrl = 'https://localhost:7037'; // your backend base URL

  const createPaymentIntent = async () => {
    const token = localStorage.getItem("token");
    const parsedBookingId = parseInt(bookingId);
    const parsedAmount = parseInt(amount);

    // ✅ Booking ID check before calling payment intent
    try {
const validateResponse = await axios.get(`${backendUrl}/api/booking/validate/${parsedBookingId}`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

      if (!validateResponse.data.success) {
        alert("❌ Invalid Booking ID. Please check and try again.");
        return;
      }
    } catch (err) {
      console.error("❌ Booking validation error:", err);
      alert("Booking ID not found or unauthorized access.");
      return;
    }

    try {
      const res = await axios.post(
        `${backendUrl}/api/payment/create-payment-intent`,
        {
          bookingId: parsedBookingId,
          amount: parsedAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log("🎯 PaymentIntent:", res.data);
      setClientSecret(res.data.clientSecret);
    } catch (err) {
      console.error("⚠️ PaymentIntent error:", err);
      alert("Failed to create payment intent");
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!stripe || !elements || !clientSecret) return;

  setIsProcessing(true);

  const cardElement = elements.getElement(CardElement);

  const result = await stripe.confirmCardPayment(clientSecret, {
    payment_method: {
      card: cardElement,
      billing_details: {
        email: email,
      },
    },
  });

  if (result.error) {
    console.error("❌ Payment error:", result.error.message);
    alert("Payment failed: " + result.error.message);
    setIsProcessing(false);
  } else if (result.paymentIntent.status === 'succeeded') {
    console.log("✅ Payment success:", result.paymentIntent);


    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `${backendUrl}/api/booking/update-payment/${bookingId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("✅ Payment successful and booking updated!");
    } catch (err) {
      console.error("⚠️ Backend update error:", err);
      alert("Payment succeeded, but failed to update booking status.");
    }

    setIsProcessing(false);
  }
};


  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Make Payment</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Booking ID</label>
          <input
            type="number"
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div .....>
          <label className="block text-sm font-medium text-gray-700">Amount (in ₹)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Card Details</label>
          <div className="p-3 border border-gray-300 rounded-md">
            <CardElement />
          </div>
        </div>

        <button
          type="button"
          onClick={createPaymentIntent}
          disabled={!bookingId || !amount}
          className="w-full py-2 px-6 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
        >
          Generate Payment Intent
        </button>

        <button
          type="submit"
          disabled={!stripe || isProcessing || !clientSecret}
          className="w-full py-3 px-6 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
        >
          {isProcessing ? "Processing..." : `Pay ₹${amount}`}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
