import { IconArrowLeft } from '@tabler/icons-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DonutChart } from '@mantine/charts';
import { Button, Container, Flex, Group, Paper, Text, Title } from '@mantine/core';

export function ResultPage() {
  const location = useLocation();
  const resultData = location.state?.resultData;
  const navigate = useNavigate();

  if (!resultData) {
    return <Text>No result data found</Text>;
  }

  const { evaluation } = resultData;

  const sections = [
    { title: 'Task Achievement', data: evaluation.task_achievement },
    { title: 'Coherence and Cohesion', data: evaluation.coherence_and_cohesion },
    { title: 'Lexical Resource', data: evaluation.lexical_resource },
    { title: 'Grammatical Range and Accuracy', data: evaluation.grammatical_range_and_accuracy },
  ];

  return (
    <Container size="100%" pt="xl" mb={32}>
      <Button
        variant="default"
        size="md"
        leftSection={<IconArrowLeft size={16} />}
        onClick={() => navigate('/dashboard')}
        style={{ position: 'absolute', top: '20px', left: '20px' }}
      >
        Back to Dashboard
      </Button>

      <Title ta="center" order={1} mb="lg" mt="xl">
        Evaluation Results
      </Title>

      <Flex gap="lg" wrap="wrap" justify="center" align="stretch">
        {sections.map((section, index) => (
          <Flex
            key={index}
            gap="md"
            align="center"
            direction={{ base: 'column', sm: 'row' }}
            style={{ maxWidth: '600px', width: '100%' }}
          >
            <Paper withBorder shadow="md" p="lg" radius="md" style={{ flex: 1, height: '100%' }}>
              <Title order={3} mb="md" ta="center">
                {section.title}
              </Title>
              <Group justify="center" gap={4}>
                <Text ta="center" fw={500}>
                  Band Score:
                </Text>
                <DonutChart
                  strokeWidth={0}
                  withTooltip={false}
                  chartLabel={section.data.band_score}
                  data={[
                    {
                      name: 'Score',
                      value: section.data.band_score,
                      color: `hsl(${section.data.band_score * 10}, 70%, 50%)`,
                    },
                    {
                      name: '',
                      value: 9 - section.data.band_score,
                      color: 'gray.6',
                    },
                  ]}
                  size={40}
                  thickness={5}
                />
              </Group>
              <Text mt="xs" ta="center">
                {section.data.feedback}
              </Text>
            </Paper>
          </Flex>
        ))}

        <Flex
          gap="md"
          align="center"
          direction={{ base: 'column', sm: 'row' }}
          w={{ base: '100%', lg: '50%' }}
          maw={{ base: '600px' }}
        >
          <Paper withBorder shadow="md" p="lg" radius="md" style={{ flex: 1 }}>
            <Title order={3} mb="md" ta="center">
              Overall
            </Title>
            <Group justify="center" gap={6}>
              <Text ta="center" fw={500}>
                Band Score:
              </Text>
              <DonutChart
                strokeWidth={0}
                withTooltip={false}
                chartLabel={evaluation.overall.band_score}
                data={[
                  {
                    name: 'Score',
                    value: evaluation.overall.band_score,
                    color: `hsl(${evaluation.overall.band_score * 10}, 70%, 50%)`,
                  },
                  {
                    name: '',
                    value: 9 - evaluation.overall.band_score,
                    color: 'gray.6',
                  },
                ]}
                size={60}
                thickness={5}
              />
            </Group>
            <Text mt="xs" ta="center">
              {evaluation.overall.feedback}
            </Text>
          </Paper>
        </Flex>
      </Flex>
    </Container>
  );
}
