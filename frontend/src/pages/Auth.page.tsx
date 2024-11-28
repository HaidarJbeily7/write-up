import { Flex, Paper, Stack, Title } from '@mantine/core';
import { ConnectWalletButton } from '@/components/ConnectWalletButton/ConnectWalletButton';

export function SigninPage() {
  return (
    <Flex mih="100vh" gap="xl" justify="center" align="center" direction="column" wrap="wrap">
      <Title order={1} mt="xl" mb="xl">
        Sign In with Your Near Wallet
      </Title>
      <Paper shadow="xs" p="xl">
        <Stack>
          <ConnectWalletButton />
        </Stack>
      </Paper>
    </Flex>
  );
}
