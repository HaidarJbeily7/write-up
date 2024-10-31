import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button,
  Container,
  Flex,
  Grid,
  Paper,
  Skeleton,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { Navbar } from '@/components/Navbar/Navbar';
import TopicCardGrid from '@/components/Topics/topicCardGrid';
import { Topic } from '@/components/Topics/types';

interface WriteUp {
  topic: string;
  content: string;
  date: Date;
}

export function DashboardPage() {
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [writeUps, setWriteUps] = useState<WriteUp[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTopics = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/topics/?size=3`
        );
        setTopics(response.data.items);
      } catch (error) {
        throw new Error(`Error Getting Topics: ${error instanceof Error ? error.message : error}`);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  const handleSubmit = () => {
    if (topic && content) {
      const newWriteUp: WriteUp = {
        topic,
        content,
        date: new Date(),
      };
      setWriteUps([newWriteUp, ...writeUps]);
      setTopic('');
      setContent('');
    }
  };

  return (
    <Grid>
      <Navbar />
      <Container w="100%">
        <Flex direction="column" align="center">
          <Title order={1} mt="xl" mb="xl">
            WriteUp Dashboard
          </Title>
          <Paper mb="xl" w="40%">
            <Stack>
              <TextInput
                label="Topic"
                placeholder="Enter your topic"
                value={topic}
                onChange={(event) => setTopic(event.currentTarget.value)}
              />
              <TextInput
                label="Content"
                placeholder="Write about your topic"
                value={content}
                onChange={(event) => setContent(event.currentTarget.value)}
              />
              <Button onClick={handleSubmit}>Submit WriteUp</Button>
            </Stack>
          </Paper>
          {loading ? (
            <>
              <Skeleton height={35} />
              <Skeleton height={10} mt={80} />
              <Skeleton height={10} mt={80} />
              <Skeleton height={10} mt={80} />
            </>
          ) : (
            <TopicCardGrid topics={topics} />
          )}
        </Flex>
      </Container>
    </Grid>
  );
}
