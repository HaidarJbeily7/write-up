import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Center, Container, Text, Title } from '@mantine/core';

export function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const paymentIntent = searchParams.get('payment_intent');
  const paymentIntentClientSecret = searchParams.get('payment_intent_client_secret');
  const redirectStatus = searchParams.get('redirect_status');

  useEffect(() => {
    if (paymentIntent && paymentIntentClientSecret) {
      if (redirectStatus) {
        axios
          .post(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/subscriptions/payment-success`,
            {
              payment_intent: paymentIntent,
            },
            {
              headers: {
                Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
              },
            }
          )
          .then((response) => {
            console.log('Payment confirmation sent successfully:', response.data);
          })
          .catch((error) => {
            console.error('Failed to confirm payment:', error);
          });
      }
    } else {
      console.log('Payment failed');
    }
  }, [paymentIntent, paymentIntentClientSecret]);

  const handleGoToProfile = () => {
    navigate('/profile');
  };

  return (
    <Container size="sm" mt="xl" style={{ textAlign: 'center' }}>
      <Title
        order={1}
        mb="lg"
        style={{ color: redirectStatus === 'succeeded' ? '#4caf50' : '#c82d2d' }}
      >
        {redirectStatus === 'succeeded' ? 'Congratulations!' : 'Sorry Your Payment was declined!'}
      </Title>
      <Text size="lg" mt="md" style={{ color: '#fffff' }}>
        {redirectStatus === 'succeeded'
          ? 'Your payment was successful.'
          : 'Please check your info and try again!'}
      </Text>
      {redirectStatus === 'succeeded' ? (
        <Text size="sm" mt="sm" mb="xl" style={{ color: '#666' }}>
          Thank you for subscribing! You can now access all premium features.
        </Text>
      ) : (
        <></>
      )}
      <Center>
        <Button size="md" mt={16} variant="gradient" bg="blue" onClick={handleGoToProfile}>
          Go to Profile
        </Button>
      </Center>
    </Container>
  );
}
