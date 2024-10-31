import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Flex, Pagination, Skeleton, Title } from '@mantine/core';
import { usePagination } from '@mantine/hooks';
import { Navbar } from '@/components/Navbar/Navbar';
import TopicCard from '@/components/Topics/topicCard';
import { Topic } from '@/components/Topics/types';

export function TopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 4;
  const pagination = usePagination({ total: totalPages, initialPage: 1 });

  const fetchTopics = async (page: number) => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/topics/`, {
        params: { size: pageSize, page },
      });
      setTopics(response.data.items);
      setTotalPages(response.data.pages);
    } catch (error) {
      throw new Error(`Error Getting Topics: ${error instanceof Error ? error.message : error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics(pagination.active);
  }, [pagination.active]);

  return (
    <Flex dir="row" mih="100vh">
      <Navbar />
      <Flex direction="column" mih="100vh" w="100%">
        <Container>
          <Title order={1} mt="xl" mb="xl" style={{ textAlign: 'center' }}>
            List of Topics
          </Title>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '2rem',
              justifyContent: 'center',
            }}
          >
            {loading
              ? Array.from({ length: pageSize }).map((_, index) => (
                  <Skeleton
                    key={index}
                    height="270px"
                    width="400px"
                    radius="md"
                    style={{ flexShrink: 0 }}
                  />
                ))
              : topics.map((topic) => <TopicCard topic={topic} />)}
          </div>
        </Container>
        <div style={{ flexGrow: 1 }} />
        <Pagination
          onChange={pagination.setPage}
          total={totalPages}
          size="md"
          disabled={loading}
          style={{ alignSelf: 'center', marginBottom: '2rem' }}
          mt="xl"
        />
      </Flex>
    </Flex>
  );
}
