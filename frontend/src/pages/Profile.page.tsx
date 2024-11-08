import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Group,
  Paper,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { Navbar } from '@/components/Navbar/Navbar';
import { useUserStore } from '@/store/user';

interface UserProfile {
  desired_band_score: number | null;
  target_exam: string | null;
  age: number | null;
  education: string | null;
  profile_metadata: {
    current_band_score: number | null;
    exam_purpose: string | null;
  } | null;
  credits_allowance: number;
  credits_spent: number;
}

export function ProfilePage() {
  const { user } = useUserStore();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          }
        );
        setProfile(response.data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <Grid w="100%" m={0}>
      <Navbar />
      <Container size="100%" p={0} px={0}>
        <Flex mt="xl" mb="xl" w="500px" justify="space-between" align="space-between">
          <Title order={1}>User Profile</Title>
          <Button onClick={() => navigate('/profile/edit')}>Edit</Button>
        </Flex>

        <Paper shadow="xs" p="xl" mb="lg" w="500px">
          <Group align="flex-start">
            <Avatar size="xl" radius="xl" color="blue">
              {user.fullname?.charAt(0)}
            </Avatar>
            <Stack>
              <Text size="xl" fw={700}>
                {user.fullname}
              </Text>
              <Text c="dimmed">{user.email}</Text>
              {profile && (
                <Group>
                  <Text fw={400} role="status" aria-label="Available credits">
                    Available Credits:
                  </Text>
                  <Text fw={500}>{profile.credits_allowance - profile.credits_spent}</Text>
                </Group>
              )}
            </Stack>
          </Group>
        </Paper>
        {profile === null &&
          Array.from({ length: 1 }).map((_, index) => (
            <Skeleton
              key={index}
              height="270px"
              width="500px"
              radius="md"
              style={{ flexShrink: 0 }}
            />
          ))}

        {profile && (
          <Paper shadow="xs" p="xl">
            <Stack>
              <Box>
                <Title order={3} mb="md">
                  Study Goals
                </Title>
                <Group grow>
                  <Paper withBorder p="md" h="100px">
                    <Text size="sm" c="dimmed">
                      Target Exam
                    </Text>
                    <Text fw={500}>{profile.target_exam || 'Not set'}</Text>
                  </Paper>

                  <Paper withBorder p="md" h="100px">
                    <Text size="sm" c="dimmed">
                      Current Band Score
                    </Text>
                    <Text fw={500}>
                      {profile.profile_metadata?.current_band_score || 'Not set'}
                    </Text>
                  </Paper>

                  <Paper withBorder p="md" h="100px">
                    <Text size="sm" c="dimmed">
                      Desired Band Score
                    </Text>
                    <Text fw={500}>{profile.desired_band_score || 'Not set'}</Text>
                  </Paper>
                </Group>

                <Group grow mt="md">
                  <Paper withBorder p="md" h="100px">
                    <Text size="sm" c="dimmed">
                      Exam Purpose
                    </Text>
                    <Text fw={500}>{profile.profile_metadata?.exam_purpose || 'Not set'}</Text>
                  </Paper>
                </Group>
              </Box>

              <Box>
                <Title order={3} mb="md">
                  Personal Information
                </Title>
                <Group grow>
                  <Paper withBorder p="md" h="100px">
                    <Text size="sm" c="dimmed">
                      Age
                    </Text>
                    <Text fw={500}>{profile.age || 'Not set'}</Text>
                  </Paper>

                  <Paper withBorder p="md" h="100px">
                    <Text size="sm" c="dimmed">
                      Education Level
                    </Text>
                    <Text fw={500}>{profile.education || 'Not set'}</Text>
                  </Paper>
                </Group>
              </Box>
            </Stack>
          </Paper>
        )}
      </Container>
    </Grid>
  );
}
