import axios from 'axios';
import {
  Anchor,
  Button,
  Divider,
  Flex,
  Group,
  Image,
  Paper,
  PaperProps,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { upperFirst, useToggle } from '@mantine/hooks';
import { GoogleButton } from './GoogleButton';

export function AuthenticationForm(props: PaperProps) {
  const [type, toggle] = useToggle(['login', 'register']);
  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
      terms: true,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
    },
  });

  const handleGoogleLogin = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/login/google`,
        { withCredentials: true }
      );

      if (response.data.url) {
        // Redirect to Google's login page
        window.location.href = response.data.url;
      }
    } catch (error) {
      throw new Error(
        `Failed to get a login link: ${error instanceof Error ? error.message : error}`
      );
    }
  };

  return (
    <Paper
      radius="xl"
      miw="500px"
      p="4.5rem"
      shadow="xl"
      style={(theme) => ({
        boxShadow: `${theme.shadows.xl}, 0px 0px 20px rgba(0, 0, 0, 0.2)`,
      })}
      {...props}
    >
      <Flex direction="column" align="center" gap="16">
        <Image src="/images/logos/writeup-logo.svg" w="10rem" />
        {type === 'register' ? (
          <Text size="xl" fw={600} c="#181D27" mb="2rem">
            Try Writeup.ai for free
          </Text>
        ) : (
          <Text size="xl" fw={600} c="#181D27" mb="2rem">
            Log in with your account
          </Text>
        )}
      </Flex>
      <form onSubmit={form.onSubmit(() => {})}>
        <Stack>
          {type === 'register' && (
            <TextInput
              placeholder="Your name"
              value={form.values.name}
              onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
              radius="md"
              size="md"
            />
          )}

          <TextInput
            required
            placeholder="Email"
            value={form.values.email}
            onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
            error={form.errors.email && 'Invalid email'}
            radius="md"
            size="md"
          />

          <PasswordInput
            required
            placeholder="Your password"
            value={form.values.password}
            onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
            error={form.errors.password && 'Password should include at least 6 characters'}
            radius="md"
            size="md"
            mb="1rem"
          />
        </Stack>
        {type !== 'register' && (
          <Text size="xs" fw={600} c="#816CA5" mb="1rem">
            Forgot password?
          </Text>
        )}

        <Button type="submit" radius="md" bg="#816CA5" w="100%">
          {upperFirst(type)}
        </Button>

        <Divider label="OR" labelPosition="center" my="lg" />

        <Group grow mb="md" mt="md">
          <GoogleButton radius="xl" onClick={handleGoogleLogin}>
            Google
          </GoogleButton>
        </Group>
        <Anchor component="button" type="button" c="dimmed" onClick={() => toggle()} size="xs">
          {type === 'register'
            ? 'Already have an account? Login'
            : "Don't have an account? Sign up"}
        </Anchor>
      </form>
    </Paper>
  );
}
