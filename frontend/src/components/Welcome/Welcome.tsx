import { useNavigate } from 'react-router-dom';
import { Button, Container, Group, Text, Title } from '@mantine/core';
import classes from './Welcome.module.css';

export function Welcome() {
  const navigate = useNavigate();
  return (
    <Container size="md">
      <Title className={classes.title} ta="center" mt={100}>
        Welcome to{' '}
        <Text inherit variant="gradient" component="span" gradient={{ from: 'blue', to: 'cyan' }}>
          WriteUp
        </Text>
      </Title>
      <Text c="dimmed" ta="center" size="lg" maw={580} mx="auto" mt="xl">
        Unleash your creativity and share your thoughts with the world. WriteUp is your platform for
        seamless writing, collaboration, and publishing.
      </Text>
      <Group justify="center" mt={50}>
        <Button
          size="lg"
          onClick={() => navigate('/dashboard')}
          variant="gradient"
          gradient={{ from: 'blue', to: 'cyan' }}
        >
          Get Started
        </Button>
        <Button size="lg" variant="outline">
          Learn More
        </Button>
      </Group>
    </Container>
  );
}
