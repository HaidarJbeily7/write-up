import {
  Anchor,
  Card,
  Group,
  SimpleGrid,
  Text,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import { Topic } from './types';
import classes from './ActionsGrid.module.css';

interface TopicCardGridProps {
  topics: Topic[];
}

export default function TopicCardGrid({ topics }: TopicCardGridProps) {
  const theme = useMantineTheme();

  const items = topics.map((topic) => (
    <UnstyledButton key={topic.id} className={classes.item} p={8}>
      <Text size="sm" c={theme.colors.blue[6]}>
        {topic.exam_type} - {topic.category}
      </Text>
      <Text size="xs" mt={7} lineClamp={3}>
        {topic.question}
      </Text>
    </UnstyledButton>
  ));

  return (
    <Card withBorder radius="md" className={classes.card}>
      <Group justify="space-between">
        <Text className={classes.title}>Topics</Text>
        <Anchor size="xs" c="dimmed" href="/topics" style={{ lineHeight: 1 }}>
          View more
        </Anchor>
      </Group>
      <SimpleGrid cols={1} mt="md">
        {items}
      </SimpleGrid>
    </Card>
  );
}
