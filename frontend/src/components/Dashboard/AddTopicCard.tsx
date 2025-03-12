import { useState } from 'react';
import { IconPlus } from '@tabler/icons-react';
import axios from 'axios';
import {
  Badge,
  Button,
  Card,
  Flex,
  Group,
  LoadingOverlay,
  Select,
  Textarea,
  Title,
} from '@mantine/core';

interface AddTopicCardProps {
  showNotification: (type: 'success' | 'error', message: string) => void;
}

function AddTopicCard({ showNotification }: AddTopicCardProps) {
  const [topic, setTopic] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);
  const [question, setQuestion] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  const handleSubmitNewTopic = async () => {
    try {
      setSubmitLoading(true);
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v2/topics/me`,
        {
          question,
          category: topic,
          exam_type: type,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );
      showNotification('success', 'Topic added successfully!');
    } catch (error) {
      showNotification('error', 'Failed to add topic.');
    } finally {
      setSubmitLoading(false);
      setQuestion('');
      setTopic('');
      setType('');
    }
  };

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      style={{
        width: 370,
        minHeight: 230,
        border: '1px dashed #7F56D9',
        backgroundColor: 'white',
        position: 'relative',
      }}
    >
      <LoadingOverlay
        visible={submitLoading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
        loaderProps={{ color: '#7F56D9' }}
      />

      {/* Title */}
      <Title order={4} fw={700} mb="sm">
        Add your topic
      </Title>

      {/* Dropdown Buttons */}
      <Group gap="xs" mb="md" c="white">
        {!topic || topic === 'Topic' ? (
          <Select
            value={topic || 'Topic'}
            data={[
              'Topic',
              'Art',
              'Business & Money',
              'Communication & Personality',
              'Crime & Punishment',
              'EDU',
              'Environment',
              'Family',
              'Food',
              'Government',
              'Health',
            ]}
            rightSection={<></>}
            leftSection={<IconPlus size={12} color="white" />}
            onChange={setTopic}
            size="xs"
            radius="md"
            withCheckIcon={false}
            styles={{
              input: {
                backgroundColor: '#816CA5',
                color: 'white',
                fontWeight: 700,
                textAlign: 'center',
                maxWidth: '5rem',
                paddingLeft: 5,
                paddingRight: 5,
              },
              dropdown: {
                minWidth: '10rem',
              },
            }}
          />
        ) : (
          <Badge color="white" bg="#816CA5" variant="light" size="md" radius="sm">
            {topic}
          </Badge>
        )}

        {!type || type === 'Type' ? (
          <Select
            data={['Type', 'IELTS', 'TOEFL']}
            value={type || 'Type'}
            onChange={setType}
            rightSection={<></>}
            leftSection={<IconPlus size={12} color="#525252" />}
            size="xs"
            radius="md"
            withCheckIcon={false}
            styles={{
              input: {
                backgroundColor: '#FFB3B3',
                color: '#525252',
                fontWeight: 700,
                textAlign: 'center',
                maxWidth: '5rem',
                paddingLeft: 5,
                paddingRight: 5,
              },
              dropdown: {
                minWidth: '10rem',
              },
            }}
          />
        ) : (
          <Badge color="#525252" bg="#FFB3B3" variant="light" size="md" radius="sm">
            {type}
          </Badge>
        )}
      </Group>

      {/* Textarea Input */}
      <Textarea
        placeholder="Writing your question here.."
        variant="unstyled"
        value={question}
        onChange={(event) => setQuestion(event.currentTarget.value)}
        size="sm"
        radius="md"
        autosize
        minRows={2}
        styles={{
          input: { fontStyle: 'italic', color: '#717680' },
        }}
      />

      {/* Add Topic Button */}
      <Flex justify="flex-start" mt="md">
        <Button color="#816CA5" radius="md" onClick={handleSubmitNewTopic} disabled={submitLoading}>
          + Add topic
        </Button>
      </Flex>
    </Card>
  );
}

export default AddTopicCard;
