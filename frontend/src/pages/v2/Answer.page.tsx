import { useEffect, useState } from 'react';
import { IconChevronRight, IconBrain, IconCloudUpload, IconScan } from '@tabler/icons-react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import {
  Anchor,
  Button,
  Container,
  Divider,
  Flex,
  Grid,
  Group,
  Loader,
  LoadingOverlay,
  Text,
  Title,
  Alert
} from '@mantine/core'
import { AnswerInput } from '@/components/Answer/AnswerInput'
import { QuestionInfo } from '@/components/Answer/QuestionInfo'
import { Navbar } from '@/components/Navbar/Navbar'
import { Topic } from '@/components/Topics/types'

export function AnswerPage () {
  const [searchParams] = useSearchParams()
  const topicId = searchParams.get('id')
  const submissionId = searchParams.get('submission_id') ?? null
  const [topic, setTopic] = useState<Topic | null>(null)
  const [initLoading, setInitLoading] = useState(false)
  const [answerLoading, setAnswerLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [answer, setAnswer] = useState('')
  const [ocrLoading, setOcrLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchTopic = async () => {
      setInitLoading(true)
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v2/topics/${topicId}`
        )
        setTopic(response.data)
      } catch (error) {
        throw new Error(`Error Getting Topic: ${error}`)
      } finally {
        setInitLoading(false)
      }
    }
    const fetchTopicSubmission = async () => {
      setInitLoading(true)
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/v2/topics/${topicId}/submissions/${submissionId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`
            }
          }
        )
        setAnswer(response.data.answer)
        setTopic(response.data.topic)
      } catch (error) {
        throw new Error(`Error Getting Topic Submission: ${error}`)
      } finally {
        setInitLoading(false)
      }
    }

    if (topicId && submissionId) {
      fetchTopicSubmission()
    } else if (topicId) {
      fetchTopic()
    }
  }, [topicId])

  const handleAnswer = async () => {
    setError(null)
    const submissionIdUpdated = await handleSaveWithoutSubmit()
    setAnswerLoading(true)
    try {
      const options = {
        method: 'POST',
        url: `${
          import.meta.env.VITE_BACKEND_URL
        }/api/v2/topics/${topicId}/submissions/${submissionIdUpdated}/evaluate`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        },
        data: { answer }
      }
      const { data } = await axios.request(options)
      navigate(`/result`, { state: { resultData: data } })
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response?.data?.detail === 'Insufficient credits'
      ) {
        setError(
          "You don't have enough credits to submit this answer. Please purchase more credits to continue."
        )
      } else {
        setError(
          `Failed to submit answer: ${
            error instanceof Error ? error.message : String(error)
          }`
        )
      }
    } finally {
      setAnswerLoading(false)
    }
  }

  const handleSaveWithoutSubmit = async () => {
    setSaveLoading(true)
    try {
      const submissionIdUpdated = submissionId ?? uuidv4()
      const options = {
        method: 'PUT',
        url: `${
          import.meta.env.VITE_BACKEND_URL
        }/api/v1/topics/${topicId}/submissions/${submissionIdUpdated}`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        },
        data: { answer }
      }
      await axios.request(options)
      return submissionIdUpdated
    } catch (error) {
      throw new Error(
        `Failed to save answer: ${
          error instanceof Error ? error.message : error
        }`
      )
    } finally {
      setSaveLoading(false)
    }
  }

  const handleInputChange = (value: string) => {
    setAnswer(value)
  }

  const handleImageUpload = async (file: File | null) => {
    if (!file) {
      return
    }
    setOcrLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/ocr/extract-text`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        }
      )

      if (response.data.extracted_text) {
        setAnswer(response.data.extracted_text)
      }
    } catch (error) {
      throw new Error(
        `Failed to extract text: ${
          error instanceof Error ? error.message : error
        }`
      )
    } finally {
      setOcrLoading(false)
    }
  }

  if (initLoading) {
    return (
      <Flex align='center' justify='center' h='100vh'>
        <Loader />
      </Flex>
    )
  }

  if (!topic) {
    return <Text>Topic not found</Text>
  }

  return (
    <Grid>
      <Grid.Col
        span='content'
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          height: '100vh',

          zIndex: 100
        }}
      >
        <Navbar />
      </Grid.Col>
      <Grid.Col span='auto'>
        <LoadingOverlay
          visible={answerLoading}
          styles={{
            overlay: {
              backdropFilter: 'blur(5px)',
              backgroundColor: 'rgba(129, 108, 165, 0.4)'
            }
          }}
          loaderProps={{
            children: (
              <Flex direction='column' align='center' gap='1rem'>
                <IconBrain size={40} stroke={1.5} color='#816CA5' />
                <Text size='lg'>The AI is Evaluate your Answer...</Text>
              </Flex>
            )
          }}
        />
        <LoadingOverlay
          visible={saveLoading}
          styles={{
            overlay: {
              backdropFilter: 'blur(5px)',
              backgroundColor: 'rgba(129, 108, 165, 0.4)'
            }
          }}
          loaderProps={{
            children: (
              <Flex direction='column' align='center' gap='1rem'>
                <IconCloudUpload size={40} stroke={1.5} color='#816CA5' />
                <Text size='lg'>Saving your answer...</Text>
              </Flex>
            )
          }}
        />
        <LoadingOverlay visible={saveLoading} loaderProps={{ children: 'Saving your answer...' }} />
        <LoadingOverlay
          visible={ocrLoading}
          styles={{
            overlay: {
              backdropFilter: 'blur(5px)',
              backgroundColor: 'rgba(129, 108, 165, 0.4)'
            }
          }}
          loaderProps={{
            children: (
              <Flex direction='column' align='center' gap='1rem'>
                <IconScan size={40} stroke={1.5} color='#816CA5' />
                <Text size='lg'>Extracting text from image...</Text>
              </Flex>
            )
          }}
        />
        {/* Header Section */}
        <Container miw='100%' p='2rem'>
          <Flex justify='space-between' align='center'>
            <Group>
              <Anchor href='/dashboard' fw={400} c='#181D27' underline='never'>
                Task2
              </Anchor>
              <IconChevronRight size={24} color='#00000066' />
              <Text fw={800}>Practice</Text>
            </Group>
            <Button variant='outline' color='#816CA5' radius='md'>
              Support
            </Button>
          </Flex>
        </Container>
        <Divider />

        {/* Page Content */}
        <Title order={1} mt='xl' mb='md' ta='center'>
          Let's Practice
        </Title>
        <Text c='#717680' ta='center' size='md' maw={580} mx='auto'>
          Challenge yourself and don't give up!
        </Text>

        <Container size='lg'>
          <QuestionInfo topic={topic} />

          <AnswerInput
            answer={answer}
            handleInputChange={handleInputChange}
            handleImageUpload={handleImageUpload}
            handleAnswer={handleAnswer}
            handleSaveWithoutSubmit={handleSaveWithoutSubmit}
            isMobile={window.innerWidth < 768}
          />
          {error && (
            <Alert color='red' title='Error' mt='md'>
              {error}
            </Alert>
          )}
        </Container>
      </Grid.Col>
    </Grid>
  )
}
