import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Flex, Grid, Skeleton, Text, Title } from '@mantine/core';
import { Navbar } from '@/components/Navbar/Navbar';
import TopicCardGrid from '@/components/Topics/topicCardGrid';
import { Topic } from '@/components/Topics/types';

export function DashboardPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTopics = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/topics/?size=5`
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

  return (
    <Grid>
      <Navbar />
      <Container w="100%">
        <Title order={1} mt="xl" mb="xl" ta="center">
          Dashboard
        </Title>
        <Text c="dimmed" ta="center" size="lg" maw={580} mx="auto" mt="xl">
          Choose Topic To start right away, Or You can Browse more Topics from the topics page!
        </Text>
        <Flex direction="column" align="center" h="100%" p={40}>
          {loading ? (
            <>
              <Skeleton height={35} />
              <Skeleton height={10} mt={80} />
              <Skeleton height={10} mt={80} />
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
