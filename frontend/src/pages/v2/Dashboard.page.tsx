import { Button, Container, Divider, Flex, Grid, Image, Text, Title } from '@mantine/core';
import FilterSelector from '@/components/Dashboard/FilterSelector';
import RandomTopicsGrid from '@/components/Dashboard/RandomTopicsGrid';
import UserTopicsGrid from '@/components/Dashboard/UserTopicGrid';
import { BurgerMenu } from '@/components/Navbar/BurgerMenu';
import { Navbar } from '@/components/Navbar/Navbar';

export function DashboardPage() {
  return (
    <Grid>
      {/* SideBar Section */}
      <Grid.Col
        span="content"
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          height: '100vh',

          zIndex: 100,
        }}
      >
        <Navbar />
      </Grid.Col>
      {/* Nvbar For Small Screens */}
      <BurgerMenu />

      {/* Rest of the Page */}
      <Grid.Col span="auto">
        <Container miw="100%" p={0}>
          {/* Header Section */}
          <Container miw="100%" p="2rem">
            <Flex justify="space-between" align="center">
              <Text c="181D27" fw={500}>
                Task2
              </Text>
              <Button variant="outline" color="#816CA5" radius="md">
                Support
              </Button>
            </Flex>
          </Container>
          <Divider />
          {/* Page Content */}
          <Title order={1} mt="xl" mb="md" ta="center">
            List of Topics
          </Title>
          <Text c="#717680" ta="center" size="md" maw={580} mx="auto">
            Choose your topic and start practice
          </Text>
          {/* Filter Selecters */}
          <FilterSelector />

          {/* Random Topics Grid */}
          <RandomTopicsGrid />

          <Image src="/icons/dashed-divider.svg" my="3rem" />

          <Title order={1} mt="xl" mb="md" ta="center">
            Your Own Topics
          </Title>
          <Text c="#717680" ta="center" size="md" maw={580} mx="auto">
            You can customize your practicing journey by adding your oun topic.
          </Text>

          {/* User Topic Grid */}
          <UserTopicsGrid />
        </Container>
      </Grid.Col>
    </Grid>
  );
}
