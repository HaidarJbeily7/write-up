import { Button, Container, em, Flex, Group, Text, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import classes from './Welcome.module.css';

export function WelcomeInternal({ navigate }: { navigate: (path: string) => void }) {
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  const handleClick = () => {
    window.open(
      'https://forms.office.com/Pages/ResponsePage.aspx?id=WuaMgIzqw0Gh_5HmWbJbeNrwVAJGAvRPqa1w8seITFdUM1laNzI3QktNSlNWV1o4TDBFTDlINTBCVS4u',
      '_blank'
    );
  };

  return (
    <Flex mih="100vh" align="center">
      <Container size="md">
        <Title className={isMobile ? '' : classes.title} ta="center">
          Welcome to{' '}
          <Text
            inherit
            variant="gradient"
            component="span"
            gradient={{ from: '#593D87', to: '#FFB3B3' }}
          >
            WriteUp
          </Text>
        </Title>
        <Text c="dimmed" ta="center" size="lg" maw={580} mx="auto" mt="xl">
          Your adaptive space to practice writing for IELTS, TOEFL, and Goethe Standard tests.
        </Text>
        <Group justify="center" mt={50}>
          <Button size="lg" onClick={() => navigate('/dashboard')} bg="#816CA5">
            Get Started
          </Button>
          <Button size="lg" variant="outline" color="#816CA5" onClick={handleClick}>
            Join Wait List
          </Button>
        </Group>
      </Container>
    </Flex>
  );
}
