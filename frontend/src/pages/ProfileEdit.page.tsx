import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Grid, NumberInput, Paper, Select, Stack, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { Navbar } from '@/components/Navbar/Navbar';
import { useUserStore } from '@/store/user';

interface ProfileFormValues {
  desired_band_score: number;
  target_exam: string;
  age: number;
  education: string;
}

export function ProfileEditPage() {
  const { user, setUser } = useUserStore();
  const navigate = useNavigate();

  const form = useForm<ProfileFormValues>({
    initialValues: {
      desired_band_score: 0,
      target_exam: '',
      age: 0,
      education: '',
    },
    validate: {
      desired_band_score: (value) =>
        value < 0 || value > 9 ? 'Band score must be between 0 and 9' : null,
      target_exam: (value) => (!value ? 'Target exam is required' : null),
      age: (value) => (value < 0 ? 'Age must be positive' : null),
      education: (value) => (!value ? 'Education level is required' : null),
    },
  });

  const handleSubmit = async (values: ProfileFormValues) => {
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/v1/users/profile`, values, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      notifications.show({
        title: 'Success',
        message: 'Profile updated successfully',
        color: 'green',
      });
      // Update user data after profile update
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      const updatedUser = response.data;
      setUser(updatedUser, updatedUser.is_active);
      navigate('/profile');
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update profile',
        color: 'red',
      });
    }
  };

  return (
    <Grid>
      <Navbar />
      <Container size="3xl">
        {!user.isActive && (
          <Paper shadow="xs" p="xl" mt="xl" bg="blue.1">
            <Text size="lg" fw={500} ta="center" c="blue.9">
              Welcome! Please complete your profile information below to start using WriteUp. This
              will help us provide you with the best possible experience.
            </Text>
          </Paper>
        )}
        <Paper shadow="xs" p="xl" mt="xl" w="100%">
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack w="100%">
              <NumberInput
                label="Desired Band Score"
                min={0}
                max={9}
                step={0.5}
                {...form.getInputProps('desired_band_score')}
              />

              <Select
                label="Target Exam"
                data={[
                  { value: 'IELTS', label: 'IELTS' },
                  { value: 'TOEFL', label: 'TOEFL' },
                ]}
                {...form.getInputProps('target_exam')}
              />

              <NumberInput label="Age" min={0} {...form.getInputProps('age')} />

              <Select
                label="Education Level"
                data={[
                  { value: 'High School', label: 'High School' },
                  { value: 'Bachelor', label: 'Bachelor' },
                  { value: 'Master', label: 'Master' },
                  { value: 'PhD', label: 'PhD' },
                  { value: 'Other', label: 'Other' },
                ]}
                {...form.getInputProps('education')}
              />

              <Button type="submit">Save Changes</Button>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Grid>
  );
}
