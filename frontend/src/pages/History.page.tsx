import { Accordion, Container, Flex, Group, ScrollArea, Text, Title } from '@mantine/core';
import { Navbar } from '@/components/Navbar/Navbar';

interface WriteUp {
  topic_category: string;
  exam_type: string;
  date: Date;
  question: string;
  answer: string;
  coherence_and_cohesion: number;
  lexical_resource: number;
  grammatical_range_and_accuracy: number;
  overall: number;
}

export function HistoryPage() {
  // Simulating writeUps data (replace with actual data fetching logic)
  const writeUps: WriteUp[] = [
    {
      topic_category: 'Family',
      exam_type: 'IELTS',
      question: `These days people are living into their 90's and beyond. As a result, there is increasing concern about care for the elderly. Do you think it is the responsibility of the family to care for their elderly members or should the government be held responsible? (frequent question)`,
      answer: `I disagree with the notion that small businesses should avoid hiring young women without families to avoid future maternity leave costs. Excluding candidates based on assumptions about potential family plans is both discriminatory and short-sighted. Young women bring valuable skills, perspectives, and energy to the workforce. Moreover, avoiding such hiring practices would promote a more diverse and inclusive workplace, which has been shown to boost productivity and morale. Policies that support work-life balance, including maternity leave, not only foster employee loyalty but also enhance the company’s reputation, attracting quality talent. Instead of excluding young women, businesses should focus on creating fair policies that benefit all employees, balancing both company needs and employee rights.`,
      date: new Date(),
      coherence_and_cohesion: 1,
      lexical_resource: 1,
      grammatical_range_and_accuracy: 1,
      overall: 9.0,
    },
    {
      topic_category: 'Crime & Punishment',
      exam_type: 'IELTS',
      question: `Many criminals commit further crimes as soon as they released from prison. What do you think are the causes of this? What possible solutions can you suggest? (Reported 2015, 2017, 2022 Academic Test)`,
      answer: `I disagree with the notion that small businesses should avoid hiring young women without families to avoid future maternity leave costs. Excluding candidates based on assumptions about potential family plans is both discriminatory and short-sighted. Young women bring valuable skills, perspectives, and energy to the workforce. Moreover, avoiding such hiring practices would promote a more diverse and inclusive workplace, which has been shown to boost productivity and morale. Policies that support work-life balance, including maternity leave, not only foster employee loyalty but also enhance the company’s reputation, attracting quality talent. Instead of excluding young women, businesses should focus on creating fair policies that benefit all employees, balancing both company needs and employee rights.`,
      date: new Date(),
      coherence_and_cohesion: 3,
      lexical_resource: 2,
      grammatical_range_and_accuracy: 2,
      overall: 6.5,
    },
  ];

  return (
    <Flex>
      <Navbar />
      <Flex direction="column" mih="100vh" w="100%" align="center">
        <Title order={1} mt="xl" mb="xl">
          WriteUp History
        </Title>
        <Container miw="80%">
          <ScrollArea h="70vh">
            <Accordion w="100%">
              {writeUps.map((writeUp, index) => (
                <Accordion.Item key={index} value={`writeUp-${index}`}>
                  <Accordion.Control>
                    <Group justify="space-between">
                      <Group>
                        <Text fw={700}>
                          {writeUp.exam_type} - {writeUp.topic_category}
                        </Text>
                        <Text size="md" c="dimmed">
                          Overall Evaluation: {writeUp.overall}
                        </Text>
                      </Group>
                      {/* <Text size="sm" c="dimmed">
                        Date: {writeUp.date.toLocaleDateString()}
                      </Text> */}
                    </Group>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Text size="sm" c="dimmed">
                      Date: {writeUp.date.toLocaleDateString()}
                    </Text>
                    <Text mt="sm">
                      <strong>Question:</strong> {writeUp.question}
                    </Text>
                    <Text mt="sm">
                      <strong>Answer:</strong> {writeUp.answer}
                    </Text>
                    <Text mt="sm">
                      <strong>Detailed Evaluation:</strong>
                    </Text>
                    <Text mt="xs">Coherence and Cohesion: {writeUp.coherence_and_cohesion}</Text>
                    <Text mt="xs">Lexical Resource: {writeUp.lexical_resource}</Text>
                    <Text mt="xs">
                      Grammatical Range and Accuracy: {writeUp.grammatical_range_and_accuracy}
                    </Text>
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>
          </ScrollArea>
        </Container>
      </Flex>
    </Flex>
  );
}
