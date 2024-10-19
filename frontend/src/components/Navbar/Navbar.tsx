import { useState } from 'react';
import {
  IconCreditCard,
  IconDashboard,
  IconHistory,
  IconLogout,
  IconUser,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { Code, Group, Text } from '@mantine/core';
import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle';
import classes from './Navbar.module.css';

const data = [
  { link: '/dashboard', label: 'Dashboard', icon: IconDashboard },
  { link: '/profile', label: 'Profile', icon: IconUser },
  { link: '/history', label: 'History', icon: IconHistory },
  { link: '/subscription', label: 'Subscription', icon: IconCreditCard },
];

export function Navbar() {
  const [active, setActive] = useState('Home');
  const navigate = useNavigate();
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
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* <img src="/logo.png" alt="WriteUp Logo" style={{ width: '30px', height: '30px', marginRight: '10px' }} /> */}
            <Text size="xl" fw={700}>
              WriteUp
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

        <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </div>
    </nav>
  );
}
