import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Flex, Pagination, Select, Skeleton, Text, Title } from '@mantine/core';
import { usePagination } from '@mantine/hooks';
// import AskForHelpButton from '@/components/AskForHelp/AskForHelpButton';
import { BurgerMenu } from '@/components/Navbar/BurgerMenu';
import { Navbar } from '@/components/Navbar/Navbar';
import TopicCard from '@/components/Topics/topicCard';
import { Topic } from '@/components/Topics/types';

export function TopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [examType, setExamType] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);

  const pageSize = 4;
  const pagination = usePagination({ total: totalPages, initialPage: 1 });

  const fetchTopics = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v2/topics/`, {
        params: {
          size: pageSize,
          exam_type: examType === 'Task 1' ? 'TOEFL' : 'IELTS',
          category,
          page: pagination.active === 0 ? 1 : pagination.active,
        },
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
    fetchTopics();
  }, [pagination.active, examType, category]);

  return (
    <Flex dir="row" mih="100vh">
      {/* <AskForHelpButton /> */}
      <Navbar />
      <BurgerMenu />
      <Flex direction="column" mih="100vh" w="100%">
        <Container>
          <Title order={1} mt="xl" mb="xl" style={{ textAlign: 'center' }}>
            List of Topics
          </Title>
          <Flex mb="lg" gap="md" justify="center">
            <Select
              label="Task Category"
              placeholder="Select Task Category"
              data={['Task 1', 'Task 2']}
              value={examType}
              onChange={(value) => {
                setExamType(value);
                pagination.setPage(1);
              }}
              clearable
            />
            <Select
              label="Category"
              placeholder="Select Category"
              data={[
                'Art',
                'Business & Money',
                'Communication & Personality',
                'Crime & Punishment',
                'EDU',
                'Environment',
                'Family',
                'Food',
                'Government',
                'Health',
              ]}
              value={category}
              onChange={(value) => {
                setCategory(value);
                pagination.setPage(1);
              }}
              clearable
            />
          </Flex>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '2rem',
              justifyContent: 'center',
            }}
          >
            {loading ? (
              Array.from({ length: pageSize }).map((_, index) => (
                <Skeleton
                  key={index}
                  height="270px"
                  width="400px"
                  radius="md"
                  style={{ flexShrink: 0 }}
                />
              ))
            ) : topics.length === 0 ? (
              <Text mt="md">No topics found. Please adjust the filters or try again later.</Text>
            ) : (
              topics.map((topic) => <TopicCard key={topic.id} topic={topic} />)
            )}
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
