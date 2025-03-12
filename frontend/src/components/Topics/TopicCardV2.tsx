import { IconCircleCheck, IconHeart, IconHeartFilled } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { Badge, Button, Card, Flex, Group, Image, Text, UnstyledButton } from '@mantine/core';

interface TopicCardProps {
  title: string;
  topic: string;
  type: string;
  done: boolean;
  favorite: boolean;
  id: string;
  image?: string;
}

function TopicCard({ title, topic, type, done, favorite, id, image }: TopicCardProps) {
  const navigate = useNavigate();

  // Function to truncate long text
  const truncateText = (text: string, maxLength = 280) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      style={{
        width: '100%',
        maxWidth: 370,
        minWidth: 368,
        minHeight: 230,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative', // Needed for absolute positioning
      }}
    >
      {/* Dynamic Badges */}
      <Group gap="xs" mb="md">
        <Badge color="white" bg="#816CA5" variant="light" size="md" radius="sm">
          {topic}
        </Badge>
        <Badge color="#525252" bg="#FFB3B3" variant="light" size="md" radius="sm">
          {type}
        </Badge>
      </Group>

      {/* Question Text (with truncation) */}
      <Text size="sm" mb={image ? '1rem' : '4rem'} c="dark" style={{ flexGrow: 1 }}>
        {truncateText(title)}
      </Text>

      {/* Conditionally Render Image */}
      {image && (
        <Image
          src={image}
          alt="Topic Image"
          radius="md"
          mb="4rem"
          style={{
            objectFit: 'cover',
            height: 'full',
          }}
        />
      )}

      {/* Bottom Section */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: done ? '#816CA5' : 'white', // Conditionally apply the purple background
          padding: '1rem',
          borderBottomLeftRadius: '8px',
          borderBottomRightRadius: '8px',
        }}
      >
        {!done ? (
          <Flex justify="space-between" align="center" mt="2rem">
            <Button
              variant="outline"
              color="#816CA5"
              radius="md"
              onClick={() => navigate(`/answer?id=${id}`)}
            >
              Let’s write
            </Button>
            <UnstyledButton>
              {favorite ? (
                <IconHeartFilled size={20} color="#8054A0" stroke={1.5} />
              ) : (
                <IconHeart size={20} color="#8054A0" stroke={1.5} />
              )}
            </UnstyledButton>
          </Flex>
        ) : (
          <Flex justify="space-between" align="center" mah="2.5rem">
            <Button variant="outline" color="white" radius="md">
              Review
            </Button>
            <Flex direction="column" align="center">
              <Flex align="center" gap="xs">
                <Text c="white" size="sm" fw={500}>
                  Done
                </Text>
                <IconCircleCheck size={18} color="white" stroke={1.5} />
              </Flex>
              <Text c="white" size="xl" fw={700}>
                6.5
              </Text>
            </Flex>
          </Flex>
        )}
      </div>
    </Card>
  );
}

export default TopicCard;
