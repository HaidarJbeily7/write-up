import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
  task_achievement: {
    band_score: number;
    feedback: string;
  };
  coherence_and_cohesion: {
    band_score: number;
    feedback: string;
  };
  lexical_resource: {
    band_score: number;
    feedback: string;
  };
  grammatical_range_and_accuracy: {
    band_score: number;
    feedback: string;
  };
  overall: {
    band_score: number;
    feedback: string;
  };
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
        url: `${import.meta.env.VITE_BACKEND_URL}/api/v1/topics/submissions`,
        headers: { Authorization: `Bearer ${import.meta.env.TOKEN}` },
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
                              Overall Evaluation: {submission.evaluation.overall.band_score}
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
                          <Text mt="sm">
                            <strong>Detailed Evaluation:</strong>
                          </Text>
                          <Text mt="xs">
                            <strong>Task Achievement: </strong>
                            <Text
                              span
                              c={`hsl(${submission.evaluation.task_achievement.band_score * 10}, 70%, 50%)`}
                              inherit
                            >
                              {submission.evaluation.task_achievement.band_score}
                            </Text>{' '}
                            - {submission.evaluation.task_achievement.feedback}
                          </Text>
                          <Text mt="xs">
                            <strong>Coherence and Cohesion: </strong>
                            <Text
                              span
                              c={`hsl(${submission.evaluation.coherence_and_cohesion.band_score * 10}, 70%, 50%)`}
                              inherit
                            >
                              {submission.evaluation.coherence_and_cohesion.band_score}
                            </Text>{' '}
                            - {submission.evaluation.coherence_and_cohesion.feedback}
                          </Text>
                          <Text mt="xs">
                            <strong>Lexical Resource: </strong>
                            <Text
                              span
                              c={`hsl(${submission.evaluation.lexical_resource.band_score * 10}, 70%, 50%)`}
                              inherit
                            >
                              {submission.evaluation.lexical_resource.band_score}
                            </Text>{' '}
                            - {submission.evaluation.lexical_resource.feedback}
                          </Text>
                          <Text mt="xs">
                            <strong>Grammatical Range and Accuracy: </strong>
                            <Text
                              span
                              c={`hsl(${submission.evaluation.grammatical_range_and_accuracy.band_score * 10}, 70%, 50%)`}
                              inherit
                            >
                              {submission.evaluation.grammatical_range_and_accuracy.band_score}
                            </Text>{' '}
                            - {submission.evaluation.grammatical_range_and_accuracy.feedback}
                          </Text>
                          <Text mt="xs">
                            <strong>Overall Score: </strong>
                            <Text
                              span
                              c={`hsl(${submission.evaluation.overall.band_score * 10}, 70%, 50%)`}
                              inherit
                            >
                              {submission.evaluation.overall.band_score}
                            </Text>{' '}
                            - {submission.evaluation.overall.feedback}
                          </Text>
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
