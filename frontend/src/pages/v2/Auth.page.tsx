import axios from 'axios';
import GoogleButton from 'react-google-button';
import { Container, Flex, Paper, Stack, Title } from '@mantine/core';
import { AuthenticationForm } from '@/components/Auth/AuthinticationForm';

export function SigninPage() {
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
    <Flex h="100vh" align="center">
      <Container>
        <AuthenticationForm />
      </Container>
    </Flex>
    // <Container>
    //   <Title order={1} mt="xl" mb="xl">
    //     Sign In with Google
    //   </Title>
    //   <Paper shadow="xs" p="xl">
    //     <Stack>
    //       <GoogleButton onClick={handleGoogleLogin} />
    //     </Stack>
    //   </Paper>
    // </Container>
  );
}
