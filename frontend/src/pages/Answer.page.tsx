import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { Loader, Paper, Text, Title } from '@mantine/core';
import { Topic } from '@/components/Topics/types';

export function AnswerPage() {
  const [searchParams] = useSearchParams();
  const topicId = searchParams.get('id');
  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTopic = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/topics/${topicId}`
        );
        setTopic(response.data);
      } catch (error) {
        throw new Error(`Error Getting Topic: ${error instanceof Error ? error.message : error}`);
      } finally {
        setLoading(false);
      }
    };

    if (topicId) {
      fetchTopic();
    }
  }, [topicId]);

  if (loading) {
    return <Loader />;
  }

  if (!topic) {
    return <Text>Topic not found</Text>;
  }

  return (
    <Paper withBorder shadow="md" p="xl" radius="md">
      <Title order={1} mb="md">
        {topic.category}
      </Title>
      <Text size="xl" fw={700} mt="md">
        {topic.exam_type}
      </Text>
      <Text mt="md">{topic.question}</Text>
    </Paper>
  );
}
