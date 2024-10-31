import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Button,
  Container,
  Flex,
  Loader,
  LoadingOverlay,
  Paper,
  Text,
  Textarea,
  Title,
} from '@mantine/core';
import { Topic } from '@/components/Topics/types';

export function AnswerPage() {
  const [searchParams] = useSearchParams();
  const topicId = searchParams.get('id');
  const [topic, setTopic] = useState<Topic | null>(null);
  const [initLoading, setInitLoading] = useState(false);
  const [answerLoading, setAnswerLoading] = useState(false);
  const [answer, setAnswer] = useState('');
  const wordLimit = 150;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopic = async () => {
      setInitLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/topics/${topicId}`
        );
        setTopic(response.data);
      } catch (error) {
        throw new Error(`Error Getting Topic: ${error}`);
      } finally {
        setInitLoading(false);
      }
    };

    if (topicId) {
      fetchTopic();
    }
  }, [topicId]);

  const handleAnswer = async () => {
    setAnswerLoading(true);
    try {
      const options = {
        method: 'POST',
        url: `${import.meta.env.VITE_BACKEND_URL}/api/v1/topics/${topicId}/answers`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        data: { answer },
      };
      const { data } = await axios.request(options);
      navigate(`/result`, { state: { resultData: data } });
    } catch (error) {
      throw new Error(
        `Failed to create payment intent: ${error instanceof Error ? error.message : error}`
      );
    } finally {
      setAnswerLoading(false);
    }
  };

  const handleInputChange = (value: string) => {
    const words = value.trim().split(/\s+/);
    if (words.length <= wordLimit) {
      setAnswer(value);
    }
  };

  if (initLoading) {
    return (
      <Flex align="center" justify="center" h="100vh">
        <Loader />
      </Flex>
    );
  }

  if (!topic) {
    return <Text>Topic not found</Text>;
  }

  return (
    <Container size="sm">
      <LoadingOverlay
        visible={answerLoading}
        loaderProps={{ children: 'The AI is checking your Answer...' }}
      />

      <Paper withBorder shadow="md" p="xl" radius="md" mt="lg">
        <Title order={1} mb="md">
          {topic.category}
        </Title>
        <Text size="lg" fw={500} mb="xs">
          Exam Type: {topic.exam_type}
        </Text>
        <Text size="md" mt="md" fw={700}>
          Question:
        </Text>
        <Text size="md">{topic.question}</Text>
      </Paper>

      <Paper withBorder shadow="md" p="xl" radius="md" mt="lg">
        <Title order={3} mb="md">
          Your Answer
        </Title>
        <Textarea
          placeholder="Write your answer here..."
          value={answer}
          onChange={(e) => handleInputChange(e.target.value)}
          minRows={4}
          maxRows={8}
          description={`${
            wordLimit - (answer.trim() === '' ? 0 : answer.trim().split(/\s+/).length)
          } words remaining`}
          required
          resize="vertical"
          styles={{
            input: {
              height: '240px',
            },
          }}
        />
        <Button fullWidth mt="md" onClick={() => handleAnswer()} disabled={answer.length === 0}>
          Submit Answer
        </Button>
      </Paper>
    </Container>
  );
}
