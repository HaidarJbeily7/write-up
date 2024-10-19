import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Container,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useUserStore } from '@/store/user';

export function SigninPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setUser, setIsLoggedIn } = useUserStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      // Simulating login
      setUser({
        name: 'Haidar',
        email: 'haidar@gmail.com',
        joinDate: new Date(),
        totalWriteUps: 0,
      });
      setIsLoggedIn(true)
      navigate('/dashboard');
    } else {
      // Simulating registration
      setUser({ name, email, joinDate: new Date(), totalWriteUps: 0 });
      navigate('/dashboard');
    }
  };

  return (
    <Container size="sm">
      <Title order={1} mt="xl" mb="xl">
        {isLogin ? 'Sign In' : 'Register'}
      </Title>
      <Paper shadow="xs" p="xl">
        <form onSubmit={handleSubmit}>
          <Stack>
            {!isLogin && (
              <TextInput
                label="Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}
            <TextInput
              label="Email"
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <PasswordInput
              label="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" fullWidth mt="md">
              {isLogin ? 'Sign In' : 'Register'}
            </Button>
          </Stack>
        </form>
      </Paper>
      <Group mt="md">
        <Text>{isLogin ? "Don't have an account?" : 'Already have an account?'}</Text>
        <Button variant="subtle" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Register' : 'Sign In'}
        </Button>
      </Group>
    </Container>
  );
}
