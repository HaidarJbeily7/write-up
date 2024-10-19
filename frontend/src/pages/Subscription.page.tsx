import { Button, Container, Grid, Paper, Stack, Text, Title } from '@mantine/core';
import { Navbar } from '@/components/Navbar/Navbar';

interface SubscriptionPlan {
  name: string;
  price: number;
  features: string[];
}

export function SubscriptionPage() {
  const subscriptionPlans: SubscriptionPlan[] = [
    {
      name: 'Basic',
      price: 9.99,
      features: ['5 WriteUps per month', 'Basic analytics'],
    },
    {
      name: 'Pro',
      price: 19.99,
      features: ['Unlimited WriteUps', 'Advanced analytics', 'Priority support'],
    },
    {
      name: 'Enterprise',
      price: 49.99,
      features: [
        'Unlimited WriteUps',
        'Advanced analytics',
        'Dedicated support',
        'Custom integrations',
      ],
    },
  ];

  return (
    <Grid>
      <Navbar />
      <Container size="xl">
        <Title order={1} mt="xl" mb="xl">
          Subscription Management
        </Title>

        <Stack>
          {subscriptionPlans.map((plan, index) => (
            <Paper key={index} shadow="xs" p="xl">
              <Title order={2}>{plan.name}</Title>
              <Text size="xl" fw={700} mt="md">
                ${plan.price}/month
              </Text>
              <Stack mt="md">
                {plan.features.map((feature, featureIndex) => (
                  <Text key={featureIndex}>{feature}</Text>
                ))}
              </Stack>
              <Button mt="xl" fullWidth>
                Subscribe
              </Button>
            </Paper>
          ))}
        </Stack>
      </Container>
    </Grid>
  );
}
