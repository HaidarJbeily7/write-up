import { useNavigate } from 'react-router-dom';
import { Paper, Text, Title, Image } from '@mantine/core';
import { Topic } from './types';

interface TopicCardGridProps {
  topic: Topic;
}


const Footer = ({topic}: TopicCardGridProps) => {
  if (topic.task_number === 1) {
    return <Image src={`/images/${topic.image_name}`} alt="Task 1" width={100} height={200} />;
  }
const truncatedQuestion =
  topic.question.length > 200
    ? `${topic.question.slice(0, 198)}...`
    : topic.question

  return (
    <div
      style={{ maxHeight: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}
    >
      <Text>{truncatedQuestion}</Text>
    </div>
  );

};


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
        width: '100%',
        maxWidth: '400px',
        minHeight: '270px', // Minimum height, allows growth if content exceeds
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
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
          {topic.task_number === 1 ? 'Task 1' : 'Task 2'}
        </Text>
        <Footer topic={topic} />
      </div>
    </Paper>
  );
}
