import React, { useEffect, useState } from 'react';
import { IconPlus } from '@tabler/icons-react';
import axios from 'axios';
import {
  Button,
  Container,
  Flex,
  LoadingOverlay,
  Modal,
  Notification,
  Pagination,
  Select,
  Skeleton,
  Text,
  Textarea,
  Title,
} from '@mantine/core';
import { usePagination } from '@mantine/hooks';
import AskForHelpButton from '@/components/AskForHelp/AskForHelpButton';
import { BurgerMenu } from '@/components/Navbar/BurgerMenu';
import { Navbar } from '@/components/Navbar/Navbar';
import TopicCard from '@/components/Topics/topicCard';
import { Topic } from '@/components/Topics/types';

export function MyTopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setsubmitLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [examType, setExamType] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newCategory, setNewCategory] = useState<string | null>(null);
  const [notification, setNotification] = useState({ type: '', message: '' });

  const pageSize = 4;
  const pagination = usePagination({ total: totalPages, initialPage: 1 });

  const fetchTopics = async () => {
    setLoading(true);
    setExamType('IELTS');
    try {
      const options = {
        method: 'GET',
        url: `${import.meta.env.VITE_BACKEND_URL}/api/v2/topics/me`,
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
        params: {
          size: pageSize,
          exam_type: examType,
          page: pagination.active === 0 ? 1 : pagination.active,
          category,
        },
      };
      const { data } = await axios.request(options);
      setTopics(data.items);
      setTotalPages(data.pages);
    } catch (error) {
      throw new Error(`Error Getting Topics: ${error instanceof Error ? error.message : error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitNewTopic = async () => {
    try {
      setsubmitLoading(true);
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v2/topics/me`,
        {
          question: newQuestion,
          category: newCategory,
          exam_type: 'IELTS',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );
      setNotification({ type: 'success', message: 'Topic added successfully!' });

      fetchTopics();
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to add topic.' });
      throw new Error(`Error Adding Topic: ${error instanceof Error ? error.message : error}`);
    } finally {
      setModalOpen(false);
      setsubmitLoading(false);
      setNewQuestion('');
      setNewCategory('');
    }
  };

  useEffect(() => {
    fetchTopics();
  }, [pagination.active, examType, category]);

  return (
    <Flex dir="row" mih="100vh">
      <LoadingOverlay
        visible={submitLoading}
        loaderProps={{ children: 'Submitting Your Topic...' }}
      />
      <AskForHelpButton />
      <Navbar />
      <BurgerMenu />
      <Flex direction="column" mih="100vh" w="100%">
        <Container>
          {notification.type && (
            <Notification
              color={notification.type === 'success' ? 'green' : 'red'}
              onClose={() => setNotification({ type: '', message: '' })}
            >
              {notification.message}
            </Notification>
          )}
          <Title order={1} mt="xl" mb="xl" style={{ textAlign: 'center' }}>
            Your Topics
          </Title>
          <Flex mb="lg" gap="md" justify="center">
            {/* <Select
              label="Exam Type"
              placeholder="IELTS"
              data={['TOEFL', 'IELTS']}
              value={examType}
              onChange={(value) => {
                setExamType(value);
                pagination.setPage(1);
              }}
              clearable
              disabled
            /> */}
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
              alignContent: 'center',
              flexDirection: topics.length < 3 && !loading ? 'column' : 'column',
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
              <Text mt="md">You don't have any topics yes!</Text>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexWrap: topics.length < 4 ? 'nowrap' : 'wrap',
                  gap: '2rem',
                  justifyContent: 'center',
                }}
              >
                {topics.map((topic) => (
                  <TopicCard key={topic.id} topic={topic} />
                ))}
              </div>
            )}
            <Button
              onClick={() => setModalOpen(true)}
              size="md"
              variant="light"
              rightSection={<IconPlus size={14} />}
            >
              Add a New Topic
            </Button>
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
      {/* Modal for Adding New Topic */}
      <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title="Add a New Topic">
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
          value={newCategory}
          onChange={(value) => {
            setNewCategory(value);
          }}
          required
        />
        <Textarea
          label="Question"
          placeholder="Enter the question"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          required
          resize="vertical"
          styles={{
            input: {
              height: '100px',
            },
          }}
        />
        <Button
          mt="md"
          fullWidth
          onClick={handleSubmitNewTopic}
          disabled={!newQuestion || !newCategory}
        >
          Submit
        </Button>
      </Modal>
    </Flex>
  );
}
