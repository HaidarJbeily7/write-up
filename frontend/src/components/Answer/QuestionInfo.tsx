import { Badge, Divider, Flex, Group, Paper, Text } from '@mantine/core';

interface QuestionInfoProps {
  topic: {
    category: string;
    exam_type: string;
    question: string;
  };
}

export function QuestionInfo({ topic }: QuestionInfoProps) {
  return (
    <Paper
      shadow="lg"
      p="xl"
      radius="lg"
      mt="lg"
      style={(theme) => ({
        boxShadow: `${theme.shadows.xl}, 0px 0px 20px rgba(0, 0, 0, 0.2)`,
      })}
    >
      <Flex justify="space-between">
        <Text fw={700}>The question</Text>
        <Group gap="xs" mb="md">
          <Badge color="white" bg="#816CA5" variant="light" size="md" radius="sm">
            {topic.category}
          </Badge>
          <Badge color="#525252" bg="#FFB3B3" variant="light" size="md" radius="sm">
            {topic.exam_type}
          </Badge>
        </Group>
      </Flex>
      <Divider />

      <Text size="md" my="md">
        {topic.question}
      </Text>
    </Paper>
  );
}
