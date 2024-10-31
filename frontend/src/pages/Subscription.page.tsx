import { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { Button, Center, Container, Grid, Paper, Stack, Text, Title } from '@mantine/core';
import { Navbar } from '@/components/Navbar/Navbar';
import PaymentForm from '@/components/Subscription/paymentForm';

interface SubscriptionPlan {
  name: string;
  price: number;
  features: string[];
}

export function SubscriptionPage() {
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(false);

  const subscriptionPlans: SubscriptionPlan[] = [
    { name: 'Basic', price: 9.99, features: ['10 WriteUps', 'Basic analytics'] },
    {
      name: 'Pro',
      price: 19.99,
      features: ['30 WriteUps', 'Advanced analytics', 'Priority support'],
    },
  ];

  const handleSubscribe = async (plan: string) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/subscriptions/create-payment-intent`,
        { plan },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );
      setClientSecret(response.data.client_secret);
    } catch (error) {
      throw new Error(
        `Failed to create payment intent: ${error instanceof Error ? error.message : error}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid>
      <Navbar />
      <Container size="xl">
        <Title order={1} mt="xl" mb="xl" style={{ textAlign: 'center' }}>
          Subscription Management
        </Title>
        <Center>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '2rem',
              justifyContent: 'center',
            }}
          >
            {subscriptionPlans.map((plan, index) => (
              <Paper
                key={index}
                shadow="md"
                p="xl"
                radius="md"
                style={{
                  width: '300px',
                  minHeight: '400px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                <div style={{ flexGrow: 1 }}>
                  <Title order={2} style={{ textAlign: 'center' }} mb="md">
                    {plan.name}
                  </Title>
                  <Text size="xl" fw={700} mt="md" style={{ textAlign: 'center' }}>
                    ${plan.price}/month
                  </Text>
                  <Stack mt="md" gap="xs">
                    {plan.features.map((feature, featureIndex) => (
                      <Text key={featureIndex} style={{ textAlign: 'center' }}>
                        {feature}
                      </Text>
                    ))}
                  </Stack>
                </div>
                <div style={{ marginTop: 'auto' }}>
                  <Button
                    fullWidth
                    onClick={() => handleSubscribe(plan.name)}
                    disabled={loading}
                    variant="gradient"
                    gradient={{ from: 'indigo', to: 'cyan' }}
                  >
                    Subscribe
                  </Button>
                </div>
              </Paper>
            ))}
          </div>
        </Center>
        {clientSecret && (
          <div className="mt-16">
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: { labels: 'floating' },
              }}
            >
              <PaymentForm />
            </Elements>
          </div>
        )}
      </Container>
    </Grid>
  );
}
