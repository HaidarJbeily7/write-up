import { useNavigate } from 'react-router-dom';
import { Paper, Text, Title } from '@mantine/core';
import { Topic } from './types';

interface TopicCardGridProps {
  topic: Topic;
}

export default function TopicCard({ topic }: TopicCardGridProps) {
  const navigate = useNavigate();
  return (
    <Paper
      withBorder
      key={topic.id}
      shadow="md"
      p="xl"
      radius="md"
      style={{
        width: '300px',
        minHeight: '350px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        cursor: 'pointer',
      }}
      onClick={() => navigate(`/answer?id=${topic.id}`)}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
    >
      <div style={{ flexGrow: 1 }}>
        <Title order={2} style={{ textAlign: 'center' }} mb="md">
          {topic.category}
        </Title>
        <Text size="xl" fw={700} mt="md" style={{ textAlign: 'center' }}>
          {topic.exam_type}
        </Text>
        <div style={{ maxHeight: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          <Text>{topic.question}</Text>
        </div>
      </div>
    </Paper>
  );
}
