import { Container, Flex } from '@mantine/core';
import { AuthenticationForm } from '@/components/Auth/AuthinticationForm';

export function SigninPage() {
  return (
    <Flex h="100vh" align="center">
      <Container>
        <AuthenticationForm />
      </Container>
    </Flex>
  );
}
