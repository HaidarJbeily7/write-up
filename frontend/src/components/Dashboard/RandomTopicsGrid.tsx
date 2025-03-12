import { useEffect, useState } from 'react';
import axios from 'axios';
import { Flex, Group, Pagination, SimpleGrid, Skeleton } from '@mantine/core';
import { Topic } from '@/components/Topics/types';
import TopicCard from '../Topics/TopicCardV2';

export default function RandomTopicsGrid() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTopics = async (pageNumber: number) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/topics/?size=6&page=${pageNumber}`
      );
      setTopics(response.data.items);
      setTotalPages(response.data.pages);
    } catch (error) {
      throw new Error(`Error Getting Topics: ${error instanceof Error ? error.message : error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics(page);
  }, [page]);

  return (
    <>
      <Group mt="2rem" mx={0} miw="70rem" justify="center">
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
                // image="images/B3.png"
              />
            ))}
          </SimpleGrid>
        )}
      </Group>

      {/* Pagination */}
      <Flex justify="center" mt="2rem">
        <Pagination color="#816CA5" total={totalPages} value={page} onChange={setPage} />
      </Flex>
    </>
  );
}
