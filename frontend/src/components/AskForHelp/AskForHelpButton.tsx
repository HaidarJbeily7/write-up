import { useEffect, useState } from 'react';
import { IconMessageCircle } from '@tabler/icons-react';
import { Affix, Button, rem, Transition } from '@mantine/core';

function AskForHelpButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show the button after 5 seconds
    const timer = setTimeout(() => {
      setVisible(true);
    }, 5000);

    return () => clearTimeout(timer); // Clear the timeout on component unmount
  }, []);

  return (
    <Affix position={{ bottom: 20, right: 20 }}>
      <Transition transition="slide-up" mounted={visible}>
        {(transitionStyles) => (
          <Button
            leftSection={<IconMessageCircle style={{ width: rem(16), height: rem(16) }} />}
            style={transitionStyles}
            onClick={() => window.open('https://t.me/writeupai', '_blank')}
          >
            Ask for Help
          </Button>
        )}
      </Transition>
    </Affix>
  );
}

export default AskForHelpButton;
