import { useState } from 'react';
import { IconLogout } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { Burger, Code, Drawer, Group, Image, Text, useMantineColorScheme } from '@mantine/core';
import { useUserStore } from '@/store/user';
import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle';
import { data } from './data';
import styles from './BurgerMenu.module.css';

export function BurgerMenu() {
  const [opened, setOpened] = useState(false);
  const navigate = useNavigate();
  const { setIsLoggedIn } = useUserStore();
  const { colorScheme } = useMantineColorScheme();

  const links = data.map((item) => (
    <a
      key={item.label}
      className={styles.link}
      href={item.link}
      onClick={(event) => {
        event.preventDefault();
        navigate(item.link);
        setOpened(false);
      }}
    >
      <item.icon className={styles.icon} stroke={1.5} /> {item.label}
    </a>
  ));

  return (
    <>
      <Burger opened={opened} onClick={() => setOpened((o) => !o)} className={styles.burgerIcon} />
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        padding="md"
        classNames={{ content: styles.drawerContent }}
        offset={8}
        radius="md"
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
        withCloseButton={false}
        transitionProps={{ transition: 'rotate-left', duration: 150, timingFunction: 'linear' }}
        size="xs"
      >
        <Group className={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '14' }}>
            <Image
              src={colorScheme === 'dark' ? 'images/logo-white.png' : 'images/logo-black.png'}
              alt="WriteUp Logo"
              style={{ width: '40px', height: '40px', marginLeft: 12 }}
            />
            <Text size="lg" fw={500}>
              riteUp
            </Text>
          </div>
          <Code fw={700}>v1.0.0</Code>
        </Group>
        {links}
        <Group>
          <ColorSchemeToggle />
        </Group>
        <a
          href="#"
          className={styles.logoutLink}
          onClick={(event) => {
            event.preventDefault();
            setIsLoggedIn(false);
            setOpened(false);
          }}
        >
          <IconLogout className={styles.icon} stroke={1.5} /> <span>Logout</span>
        </a>
      </Drawer>
    </>
  );
}
