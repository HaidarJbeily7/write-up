import { IconChevronDown } from '@tabler/icons-react';
import { Flex, Select } from '@mantine/core';

export default function FilterSelector() {
  return (
    <Flex gap="1rem" justify="center" content="center" mt="2rem">
      <Select
        data={['Task 1', 'Task 2']}
        defaultValue="Task 2"
        variant="filled"
        radius="md"
        size="lg"
        maw="9rem"
        styles={{ input: { backgroundColor: '#8054A0', color: 'white' } }}
        rightSection={<IconChevronDown size={18} color="white" />}
        checkIconPosition="right"
      />
      <Select
        data={['All Topics', 'Topic 1', 'Topic 2']}
        defaultValue="All Topics"
        variant="filled"
        rightSection={<IconChevronDown size={18} color="white" />}
        radius="md"
        maw="9rem"
        size="lg"
        styles={{ input: { backgroundColor: '#8054A0', color: 'white' } }}
        checkIconPosition="right"
      />
      <Select
        data={['All Types', 'Type 1', 'Type 2']}
        defaultValue="All Types"
        rightSection={<IconChevronDown size={18} color="white" />}
        variant="filled"
        radius="md"
        maw="9rem"
        size="lg"
        styles={{ input: { backgroundColor: '#8054A0', color: 'white' } }}
        checkIconPosition="right"
      />
    </Flex>
  );
}
