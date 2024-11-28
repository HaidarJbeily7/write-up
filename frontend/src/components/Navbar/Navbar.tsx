import { useContext, useState } from 'react';
import { IconLogout } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { Code, Group, Image, Text, useMantineColorScheme } from '@mantine/core';
import { useUserStore } from '@/store/user';
import { WalletContext } from '@/WalletContext';
import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle';
import { data } from './data';
import classes from './Navbar.module.css';

export function Navbar() {
  const [active, setActive] = useState('Home');
  const navigate = useNavigate();
  const { setIsLoggedIn } = useUserStore();
  const { colorScheme } = useMantineColorScheme();
  const { selector } = useContext(WalletContext);

  const links = data.map((item) => (
    <a
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
        navigate(item.link);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify="space-between" align="center">
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
      </div>

      <div className={classes.footer}>
        <Group className={classes.link} justify="space-between" align="center">
          <ColorSchemeToggle />
        </Group>

        <a
          href="#"
          className={classes.link}
          onClick={async (event) => {
            localStorage.setItem('already_redirected', 'false');
            const wallet = await selector?.wallet();
            await wallet?.signOut();
            event.preventDefault();
            setIsLoggedIn(false);
          }}
        >
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </div>
    </nav>
  );
}
