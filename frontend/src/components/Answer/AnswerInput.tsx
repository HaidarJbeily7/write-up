import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  FileButton,
  Flex,
  Group,
  Image,
  Paper,
  Stack,
  Switch,
  Text,
  Textarea,
  Title,
  UnstyledButton,
} from '@mantine/core';

interface AnswerInputProps {
  answer: string;
  handleInputChange: (value: string) => void;
  handleImageUpload: (file: File | null) => void;
  handleAnswer: () => void;
  handleSaveWithoutSubmit: () => Promise<string>;
  isMobile: boolean;
}

export function AnswerInput({
  answer,
  handleInputChange,
  handleImageUpload,
  handleAnswer,
  handleSaveWithoutSubmit,
  isMobile,
}: AnswerInputProps) {
  const navigate = useNavigate();
  const [isWordCounterEnabled, setIsWordCounterEnabled] = useState(false);
  const [isTimerEnabled, setIsTimerEnabled] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerEnabled) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      setTimeElapsed(0);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isTimerEnabled]);

  // Convert timeElapsed (seconds) to MM:SS format
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <Paper
      withBorder
      p="xl"
      radius="lg"
      mt="lg"
      style={{
        borderColor: '#0000007e',
      }}
    >
      <Group mb="md" justify="space-between">
        <Title order={4}>Write your essay</Title>

        <Group gap="1.5rem">
          <FileButton onChange={handleImageUpload} accept="image/*">
            {(props) => (
              <UnstyledButton variant="light" {...props}>
                <Image src="icons/scan-icon.svg" />
              </UnstyledButton>
            )}
          </FileButton>
          <Stack gap="0" align="center" justify="center">
            <Text fw={300} size="xs">
              TIMER
            </Text>
            <Switch
              checked={isTimerEnabled}
              onChange={(event) => setIsTimerEnabled(event.currentTarget.checked)}
            />
          </Stack>
          <Stack gap="0" align="center" justify="center">
            <Text fw={300} size="xs">
              WORD COUNTER
            </Text>
            <Switch
              checked={isWordCounterEnabled}
              onChange={(event) => setIsWordCounterEnabled(event.currentTarget.checked)}
            />
          </Stack>
        </Group>
      </Group>
      <Image src="icons/dashed-line.svg" mb="1rem" />

      {/* Word Counter & Timer - Only visible if either switch is ON */}
      {(isWordCounterEnabled || isTimerEnabled) && (
        <Group justify="space-between" mb="sm">
          {isWordCounterEnabled ? (
            <Text size="sm" fw={500}>
              Word Count: {answer.trim() === '' ? 0 : answer.trim().split(/\s+/).length}
            </Text>
          ) : (
            <div />
          )}
          {isTimerEnabled && (
            <Text size="sm" fw={500}>
              Timer: {formatTime(timeElapsed)}
            </Text>
          )}
        </Group>
      )}
      <Textarea
        placeholder="Start writing here"
        variant="unstyled"
        value={answer}
        onChange={(e) => handleInputChange(e.target.value)}
        minRows={4}
        maxRows={8}
        required
        resize="vertical"
        styles={{
          input: {
            height: '240px',
            color: '#717680',
          },
        }}
      />
      <Flex mt="md" gap={8} direction={isMobile ? 'column' : 'row'}>
        <Button onClick={handleAnswer} disabled={answer.length === 0} color="#816CA5">
          Check my essay
        </Button>
        <Button
          variant="outline"
          color="#816CA5"
          onClick={async () => {
            await handleSaveWithoutSubmit();
            navigate('/history');
          }}
          disabled={answer.length === 0}
        >
          Save as a draft
        </Button>
      </Flex>
    </Paper>
  );
}
