import { IconArrowLeft } from '@tabler/icons-react';
import Markdown from 'react-markdown';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Container, Text, Title } from '@mantine/core';

export function ResultPage() {
  const location = useLocation();
  const resultData = location.state?.resultData;
  const navigate = useNavigate();

  if (!resultData) {
    return <Text>No result data found</Text>;
  }

  const { evaluation } = resultData;

  return (
    <Container size="100%" pt="xl" mb={32}>
      <Button
        variant="default"
        size="md"
        leftSection={<IconArrowLeft size={16} />}
        onClick={() => navigate('/dashboard')}
        style={{ position: 'absolute', top: '20px', left: '20px' }}
      >
        Back to Dashboard
      </Button>

      <Title ta="center" order={1} mb="lg" mt="xl">
        Evaluation Results
      </Title>

      <Container>
        <Markdown>{evaluation}</Markdown>
      </Container>
    </Container>
  );
}
