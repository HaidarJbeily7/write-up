import { useState } from 'react';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Button, Text } from '@mantine/core';

export default function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: 'http://localhost:5173/subscription/success',
      },
    });

    if (error) {
      setErrorMessage(error.message || 'An unknown error occurred');
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button type="submit" disabled={!stripe || loading} fullWidth mt="xl">
        {loading ? 'Processing...' : 'Pay Now'}
      </Button>
      {errorMessage && <Text c="red">{errorMessage}</Text>}
    </form>
  );
}
