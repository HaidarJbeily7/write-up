import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Flex, Text } from '@mantine/core';
import { WalletContext } from '../../WalletContext';

export const ConnectWalletButton: React.FC = () => {
  const { modal, accountId } = useContext(WalletContext);
  const navigate = useNavigate();

  const handleConnectWallet = () => {
    if (modal) {
      modal.show();
    }
  };

  const handleGoToDash = async () => {
    navigate('/dashboard');
  };

  return (
    <div>
      {accountId ? (
        <Flex mih={50} gap="xl" justify="center" align="center" direction="column" wrap="wrap">
          <Text fw={500} size="lg">
            Connected as {accountId}
          </Text>
          <Text size="lg">In Case you have not been redirected click on the button below</Text>

          <Button
            onClick={handleGoToDash}
            variant="gradient"
            gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
            size="lg"
          >
            Go to Dashboard
          </Button>
        </Flex>
      ) : (
        <Button
          onClick={handleConnectWallet}
          variant="gradient"
          gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
          size="lg"
        >
          Connect NEAR Wallet
        </Button>
      )}
    </div>
  );
};
