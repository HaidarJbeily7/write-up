import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Markdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import {
  Accordion,
  Button,
  Container,
  Flex,
  Group,
  ScrollArea,
  Skeleton,
  Text,
  Title,
} from '@mantine/core';
import AskForHelpButton from '@/components/AskForHelp/AskForHelpButton';
import { BurgerMenu } from '@/components/Navbar/BurgerMenu';
import { Navbar } from '@/components/Navbar/Navbar';

interface Evaluation {
  evaluation: string;
}

interface Submission {
  id: string;
  topic_id: string;
  answer: string;
  created_at: string;
  updated_at: string;
  evaluation?: Evaluation; // Optional, as not all submissions have evaluations
  question: string;
  category: string;
  exam_type: string;
}

export function HistoryPage() {
  const [history, setHistory] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      const options = {
        method: 'GET',
        url: `${import.meta.env.VITE_BACKEND_URL}/api/v2/topics/submissions`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      };
      setLoading(true);
      try {
        const { data } = await axios.request(options);

        // Flatten the data structure to extract each submission independently
        const submissions: Submission[] = data.flatMap((item: any) =>
          item.submissions.map((submission: any) => ({
            ...submission,
            question: item.question,
            category: item.category,
            exam_type: item.exam_type,
          }))
        );

        setHistory(submissions);
      } catch (error) {
        throw new Error(`Error Getting Topics: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <Flex>
      <AskForHelpButton />
      <Navbar />
      <BurgerMenu />
      <Flex direction="column" mih="100vh" w="100%" align="center">
        <Title order={1} mt="xl" mb="xl">
          WriteUp History
        </Title>
        <Container miw="80%">
          {loading ? (
            <Skeleton height="70vh" radius="xl" />
          ) : history.length === 0 ? (
            <Text>No history found</Text>
          ) : (
            <ScrollArea h="70vh">
              <Accordion w="100%" variant="contained" radius="md">
                {history.map((submission) => (
                  <Accordion.Item key={submission.id} p={12} value={`submission-${submission.id}`}>
                    <Accordion.Control>
                      <Group justify="space-between">
                        <Group>
                          <Text fw={700}>
                            {submission.exam_type} - {submission.category}
                          </Text>
                          <Text size="md" c="dimmed">
                            Submitted on: {new Date(submission.created_at).toLocaleDateString()}
                          </Text>
                          {submission.evaluation ? (
                            <Text size="md" c="dimmed">
                              Submitted
                            </Text>
                          ) : (
                            <Text size="md" c="dimmed">
                              Not submitted for Evaluation yet!
                            </Text>
                          )}
                        </Group>
                      </Group>
                    </Accordion.Control>
                    <Accordion.Panel>
                      <Text size="sm" c="dimmed">
                        <strong>Question:</strong> {submission.question}
                      </Text>
                      <Text mt="sm">
                        <strong>Answer:</strong> {submission.answer}
                      </Text>
                      {submission.evaluation ? (
                        <>
                          <Markdown>{submission.evaluation.evaluation}</Markdown>
                        </>
                      ) : (
                        <Button
                          mt="sm"
                          variant="outline"
                          onClick={() =>
                            navigate(
                              `/answer?id=${submission.topic_id}&submission_id=${submission.id}`
                            )
                          }
                        >
                          Continue Writing
                        </Button>
                      )}
                    </Accordion.Panel>
                  </Accordion.Item>
                ))}
              </Accordion>
            </ScrollArea>
          )}
        </Container>
      </Flex>
    </Flex>
  );
}
