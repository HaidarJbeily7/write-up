import React, { useEffect, useState } from 'react';
import { IconEdit, IconSquareRoundedCheck, IconXboxX } from '@tabler/icons-react';
import axios from 'axios';
import {
  ActionIcon,
  Button,
  Container,
  Flex,
  Group,
  NumberInput,
  Pagination,
  Table,
  TextInput,
  Title,
} from '@mantine/core';
import { usePagination } from '@mantine/hooks';

type User = {
  id: string;
  email: string;
  name: string;
  credits: number;
};

export function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editing, setEditing] = useState<{ [id: string]: boolean }>({});
  const [values, setValues] = useState<{ [id: string]: number }>({});

  const itemsPerPage = 10;
  const pagination = usePagination({
    total: Math.ceil(users.length / itemsPerPage),
    initialPage: 1,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const options = {
          method: 'GET',
          url: `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
        };
        const { data } = await axios.request(options);
        const formattedUsers = data.map((user: any) => ({
          id: user.id,
          email: user.email,
          name: user.full_name,
          credits: user.credits_allowance - user.credits_spent,
        }));
        setUsers(formattedUsers);
        setValues(
          formattedUsers.reduce((acc: { [id: string]: number }, user: User) => {
            acc[user.id] = 0;
            return acc;
          }, {})
        );
      } catch (error) {
        throw new Error(`Error fetching users: ${error instanceof Error ? error.message : error}`);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = () => {
    const filteredUsers = users.filter((user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setUsers(filteredUsers);
    pagination.setPage(1);
  };

  const handleIncreaseCredits = async (id: string) => {
    const amount = values[id];
    if (amount <= 0) {
      return;
    }

    try {
      const options = {
        method: 'POST',
        url: `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}/credits`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'text/plain;charset=UTF-8',
        },
        params: {
          credits: amount,
        },
      };
      await axios.request(options);

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, credits: user.credits + amount } : user
        )
      );
      setEditing((prev) => ({ ...prev, [id]: false }));
      setValues((prev) => ({ ...prev, [id]: 0 }));
      // eslint-disable-next-line
      alert(`Credits updated for user with ID ${id} by ${amount}`);
    } catch (error) {
      throw new Error(`Error updating credits: ${error instanceof Error ? error.message : error}`);
    }
  };

  const paginatedUsers = users.slice(
    (pagination.active - 1) * itemsPerPage,
    pagination.active * itemsPerPage
  );

  return (
    <Container>
      <Flex direction="column" justify="center" gap="xl" align="center" wrap="wrap">
        <Title my="lg">Admin Dashboard</Title>
        <Container w="100%">
          <TextInput
            placeholder="Search by email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.currentTarget.value)}
          />
          <Button onClick={handleSearch} mt="sm">
            Search
          </Button>
        </Container>

        <Table highlightOnHover mt="lg">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Email</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Current Credits</Table.Th>
              <Table.Th>Update Credits by:</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {paginatedUsers.map((user) => (
              <Table.Tr key={user.id}>
                <Table.Td>{user.email}</Table.Td>
                <Table.Td>{user.name}</Table.Td>
                <Table.Td>{user.credits}</Table.Td>
                <Table.Td>
                  <Container fluid p={0}>
                    <Group>
                      <NumberInput
                        variant="unstyled"
                        hideControls
                        placeholder="Amount"
                        value={values[user.id]}
                        onChange={(value) =>
                          setValues((prev) => ({ ...prev, [user.id]: Number(value) || 0 }))
                        }
                        min={1}
                        step={1}
                        disabled={!editing[user.id]}
                      />
                      {!editing[user.id] ? (
                        <ActionIcon variant="filled" aria-label="Edit">
                          <IconEdit
                            style={{ width: '70%', height: '70%' }}
                            stroke={1.5}
                            onClick={() => setEditing((prev) => ({ ...prev, [user.id]: true }))}
                          />
                        </ActionIcon>
                      ) : (
                        <>
                          <ActionIcon variant="filled" aria-label="Save" bg="green">
                            <IconSquareRoundedCheck
                              style={{ width: '70%', height: '70%' }}
                              stroke={1.5}
                              onClick={() => handleIncreaseCredits(user.id)}
                            />
                          </ActionIcon>
                          <ActionIcon variant="filled" aria-label="Save" bg="red">
                            <IconXboxX
                              style={{ width: '70%', height: '70%' }}
                              stroke={1.5}
                              onClick={() => setEditing((prev) => ({ ...prev, [user.id]: false }))}
                            />
                          </ActionIcon>
                        </>
                      )}
                    </Group>
                  </Container>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        <Pagination
          total={pagination.range.length}
          value={pagination.active}
          onChange={pagination.setPage}
          mt="lg"
        />
      </Flex>
    </Container>
  );
}
