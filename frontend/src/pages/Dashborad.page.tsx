import React, { useState } from 'react';
import { Button, Container, Grid, Paper, Stack, TextInput, Title } from '@mantine/core';
import { Navbar } from '@/components/Navbar/Navbar';

interface WriteUp {
  topic: string;
  content: string;
  date: Date;
}

export function DashboardPage() {
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [writeUps, setWriteUps] = useState<WriteUp[]>([]);

  const handleSubmit = () => {
    if (topic && content) {
      const newWriteUp: WriteUp = {
        topic,
        content,
        date: new Date(),
      };
      setWriteUps([newWriteUp, ...writeUps]);
      setTopic('');
      setContent('');
    }
  };

  return (
    <Grid>
      <Navbar />
      <Container size="xl">
        <Title order={1} mt="xl" mb="xl">
          WriteUp Dashboard
        </Title>

        <Paper mb="xl">
          <Stack>
            <TextInput
              label="Topic"
              placeholder="Enter your topic"
              value={topic}
              onChange={(event) => setTopic(event.currentTarget.value)}
            />
            <TextInput
              label="Content"
              placeholder="Write about your topic"
              value={content}
              onChange={(event) => setContent(event.currentTarget.value)}
            />
            <Button onClick={handleSubmit}>Submit WriteUp</Button>
          </Stack>
        </Paper>
      </Container>
    </Grid>
  );
}
