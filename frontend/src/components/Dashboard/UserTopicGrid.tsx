import { useEffect, useState } from 'react';
import axios from 'axios';
import { Flex, Group, Notification, Pagination, Portal, SimpleGrid, Skeleton } from '@mantine/core';
import { usePagination } from '@mantine/hooks';
import { Topic } from '@/components/Topics/types';
import TopicCard from '../Topics/TopicCardV2';
import AddTopicCard from './AddTopicCard';

export default function UserTopicsGrid() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [examType, setExamType] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const pageSize = 5;
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

  useEffect(() => {
    fetchTopics();
  }, []);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });

    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <>
      <Group mt="2rem" mx={0} miw="70rem" justify="center">
        <Portal>
          {notification && (
            <div
              style={{
                position: 'fixed',
                top: 20,
                right: 20,
                zIndex: 1000,
              }}
            >
              <Notification
                color={notification.type === 'success' ? 'green' : 'red'}
                onClose={() => setNotification(null)}
                withCloseButton
              >
                {notification.message}
              </Notification>
            </div>
          )}
        </Portal>
        {loading ? (
          <SimpleGrid cols={3} spacing="xs">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} height={230} width={370} radius="md" />
            ))}
          </SimpleGrid>
        ) : (
          <SimpleGrid cols={3} spacing="xs">
            {topics.map((topic) => (
              <TopicCard
                key={topic.id}
                title={topic.question}
                type="Type"
                topic="Topic"
                done={false}
                favorite={false}
                id={topic.id}
              />
            ))}
            <AddTopicCard showNotification={showNotification} />
          </SimpleGrid>
        )}
      </Group>

      {/* Pagination */}
      <Flex justify="center" mt="2rem" mb="4rem">
        <Pagination color="#816CA5" total={totalPages} value={page} onChange={setPage} />
      </Flex>
    </>
  );
}
