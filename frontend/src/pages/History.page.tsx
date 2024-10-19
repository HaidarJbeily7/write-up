import { Container, Grid, Group, Paper, Text, Title } from '@mantine/core';
import { Navbar } from '@/components/Navbar/Navbar';

interface WriteUp {
  topic: string;
  content: string;
  date: Date;
}

export function HistoryPage() {
  // Simulating writeUps data (replace with actual data fetching logic)
  const writeUps: WriteUp[] = [
    { topic: 'Sample Topic 1', content: 'Sample content 1', date: new Date() },
    { topic: 'Sample Topic 2', content: 'Sample content 2', date: new Date() },
    // Add more sample data as needed
  ];

  return (
    <Grid>
      <Navbar />
      <Container size="xl">
        <Title order={1} mt="xl" mb="xl">
          WriteUp History
        </Title>

        {writeUps.map((writeUp, index) => (
          <Paper key={index} shadow="xs" p="md" mb="md">
            <Group justify="apart">
              <Text fw={700}>{writeUp.topic}</Text>
              <Text size="sm" c="dimmed">
                {writeUp.date.toLocaleDateString()}
              </Text>
            </Group>
            <Text mt="xs">{writeUp.content}</Text>
          </Paper>
        ))}
      </Container>
    </Grid>
  );
}
