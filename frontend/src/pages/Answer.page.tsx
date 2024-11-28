import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import {
  Button,
  Container,
  Flex,
  Group,
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
  const submissionId = searchParams.get('submission_id') ?? null;
  const [topic, setTopic] = useState<Topic | null>(null);
  const [initLoading, setInitLoading] = useState(false);
  const [answerLoading, setAnswerLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [answer, setAnswer] = useState('');
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
    const fetchTopicSubmission = async () => {
      setInitLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/topics/${topicId}/submissions/${submissionId}`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.TOKEN}`,
            },
          }
        );
        setAnswer(response.data.answer);
        setTopic(response.data.topic);
      } catch (error) {
        throw new Error(`Error Getting Topic Submission: ${error}`);
      } finally {
        setInitLoading(false);
      }
    };

    if (topicId && submissionId) {
      fetchTopicSubmission();
    } else if (topicId) {
      fetchTopic();
    }
  }, [topicId]);

  const handleAnswer = async () => {
    const submissionIdUpdated = await handleSaveWithoutSubmit();
    setAnswerLoading(true);
    try {
      const options = {
        method: 'POST',
        url: `${import.meta.env.VITE_BACKEND_URL}/api/v1/topics/${topicId}/submissions/${submissionIdUpdated}/evaluate`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.TOKEN}`,
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

  const handleSaveWithoutSubmit = async () => {
    setSaveLoading(true);
    try {
      const submissionIdUpdated = submissionId ?? uuidv4();
      const options = {
        method: 'PUT',
        url: `${import.meta.env.VITE_BACKEND_URL}/api/v1/topics/${topicId}/submissions/${submissionIdUpdated}`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.TOKEN}`,
        },
        data: { answer },
      };
      await axios.request(options);
      return submissionIdUpdated;
    } catch (error) {
      throw new Error(`Failed to save answer: ${error instanceof Error ? error.message : error}`);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleInputChange = (value: string) => {
    setAnswer(value);
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
    <Container size="sm" h="100vh" pt={40}>
      <LoadingOverlay
        visible={answerLoading}
        loaderProps={{ children: 'The AI is checking your Answer...' }}
      />
      <LoadingOverlay visible={saveLoading} loaderProps={{ children: 'Saving your answer...' }} />
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
          description={`${answer.trim() === '' ? 0 : answer.trim().split(/\s+/).length} words`}
          required
          resize="vertical"
          styles={{
            input: {
              height: '240px',
            },
          }}
        />
        <Group mt="md" grow>
          <Button onClick={() => handleAnswer()} disabled={answer.length === 0}>
            Submit Answer For Evaluation
          </Button>
          <Button
            variant="outline"
            onClick={async () => {
              await handleSaveWithoutSubmit();
              navigate('/history');
            }}
            disabled={answer.length === 0}
          >
            Save to Continue Later
          </Button>
        </Group>
      </Paper>
    </Container>
  );
}
