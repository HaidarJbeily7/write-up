import { Avatar, Container, Grid, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { Navbar } from '@/components/Navbar/Navbar';

interface User {
  name: string;
  email: string;
  joinDate: Date;
  totalWriteUps: number;
}

export function ProfilePage() {
  // Simulating user data (replace with actual data fetching logic)
  const user: User = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    joinDate: new Date('2023-01-01'),
    totalWriteUps: 15,
  };

  return (
    <Grid>
      <Navbar />
      <Container size="xl">
        <Title order={1} mt="xl" mb="xl">
          User Profile
        </Title>

        <Paper shadow="xs" p="xl">
          <Group align="flex-start">
            <Avatar size="xl" radius="xl" color="blue">
              JD
            </Avatar>
            <Stack>
              <Text size="xl" fw={700}>
                {user.name}
              </Text>
              <Text>{user.email}</Text>
              <Text size="sm" c="dimmed">
                Joined: {user.joinDate.toLocaleDateString()}
              </Text>
              <Text>Total WriteUps: {user.totalWriteUps}</Text>
            </Stack>
          </Group>
        </Paper>
      </Container>
    </Grid>
  );
}
