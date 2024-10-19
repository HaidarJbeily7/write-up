import { IconMoon, IconSun } from '@tabler/icons-react';
import { Group, Switch, useMantineColorScheme } from '@mantine/core';

export function ColorSchemeToggle() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <Group justify="center">
      {colorScheme === 'light' ? <IconSun size={18} /> : <IconMoon size={18} />}

      <Switch checked={colorScheme === 'dark'} onChange={() => toggleColorScheme()} />
    </Group>
  );
}
