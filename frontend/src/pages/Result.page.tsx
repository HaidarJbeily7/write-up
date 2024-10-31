import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Container, Flex, Paper, Text, Title } from '@mantine/core';

export function ResultPage() {
  const location = useLocation();
  const resultData = location.state?.resultData;
  const navigate = useNavigate();

  if (!resultData) {
    return <Text>No result data found</Text>;
  }

  const { evaluation } = resultData;

  return (
    <Flex gap="md" justify="center" align="center" direction="column" m="xl">
      <Container size="sm">
        <Paper withBorder shadow="md" p="xl" radius="md" mt="lg">
          <Title order={1} mb="md">
            Evaluation Results
          </Title>

          <Title order={3}>Task Achievement</Title>
          <Text>Band Score: {evaluation.task_achievement.band_score}</Text>
          <Text>Feedback: {evaluation.task_achievement.feedback}</Text>

          <Title order={3}>Coherence and Cohesion</Title>
          <Text>Band Score: {evaluation.coherence_and_cohesion.band_score}</Text>
          <Text>Feedback: {evaluation.coherence_and_cohesion.feedback}</Text>

          <Title order={3}>Lexical Resource</Title>
          <Text>Band Score: {evaluation.lexical_resource.band_score}</Text>
          <Text>Feedback: {evaluation.lexical_resource.feedback}</Text>

          <Title order={3}>Grammatical Range and Accuracy</Title>
          <Text>Band Score: {evaluation.grammatical_range_and_accuracy.band_score}</Text>
          <Text>Feedback: {evaluation.grammatical_range_and_accuracy.feedback}</Text>

          <Title order={3}>Overall</Title>
          <Text>Band Score: {evaluation.overall.band_score}</Text>
          <Text>Feedback: {evaluation.overall.feedback}</Text>
        </Paper>
      </Container>
      <Button
        size="lg"
        variant="gradient"
        gradient={{ from: 'blue', to: 'cyan', deg: 84 }}
        onClick={() => navigate('/dashboard')}
      >
        Go back to Dashboard
      </Button>
    </Flex>
  );
}
