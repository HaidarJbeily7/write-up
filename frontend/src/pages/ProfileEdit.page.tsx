import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Grid, NumberInput, Paper, Select, Stack, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { Navbar } from '@/components/Navbar/Navbar';
import { useUserStore } from '@/store/user';

interface ProfileFormValues {
  desired_band_score: number;
  current_band_score: number;
  target_exam: string;
  exam_purpose: string;
  age: number;
  education: string;
}

export function ProfileEditPage() {
  const { user, setUser } = useUserStore();
  const navigate = useNavigate();

  const form = useForm<ProfileFormValues>({
    initialValues: {
      desired_band_score: 0,
      current_band_score: 0,
      target_exam: '',
      exam_purpose: '',
      age: 0,
      education: '',
    },
    validate: {
      desired_band_score: (value) =>
        value < 0 || value > 9 ? 'Band score must be between 0 and 9' : null,
      current_band_score: (value) =>
        value < 0 || value > 9 ? 'Band score must be between 0 and 9' : null,
      target_exam: (value) => (!value ? 'Target exam is required' : null),
      exam_purpose: (value) => (!value ? 'Exam purpose is required' : null),
      age: (value) => (value < 0 ? 'Age must be positive' : null),
      education: (value) => (!value ? 'Education level is required' : null),
    },
  });

  const handleSubmit = async (values: ProfileFormValues) => {
    try {
      const profileData = {
        ...values,
        profile_metadata: {
          current_band_score: values.current_band_score,
          exam_purpose: values.exam_purpose,
        },
      };
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/v1/users/profile`, profileData, {
        headers: {
          Authorization: `Bearer ${import.meta.env.TOKEN}`,
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
          Authorization: `Bearer ${import.meta.env.TOKEN}`,
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
      <Container size="3xl" style={{ width: '60%' }}>
        {!user.isActive && (
          <Paper shadow="xs" p="xl" mt="xl" bg="blue.1">
            <Text size="lg" fw={500} ta="center" c="blue.9">
              Welcome! Please complete your profile information below to start using WriteUp. This
              will help us provide you with the best possible experience.
            </Text>
          </Paper>
        )}
        <Paper shadow="xs" p="xl" mt="xl" style={{ width: '100%' }}>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack style={{ width: '100%' }}>
              <NumberInput
                label="Current Band Score"
                min={0}
                max={9}
                step={0.5}
                {...form.getInputProps('current_band_score')}
              />

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

              <Select
                label="Exam Purpose"
                data={[
                  { value: 'Study', label: 'Study' },
                  { value: 'Travel', label: 'Travel (Visa Application/Immigration)' },
                ]}
                {...form.getInputProps('exam_purpose')}
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
