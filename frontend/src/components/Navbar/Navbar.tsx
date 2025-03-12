import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Group, Image } from '@mantine/core';
import { data } from './data';
import classes from './Navbar.module.css';

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
      <img src={item.icon} alt={item.label} className={classes.linkIcon} width={24} height={24} />
      <span>{item.label}</span>
    </a>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify="space-between" align="center">
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '14' }}>
            <Image src="images/logos/writeup-logo.svg" alt="WriteUp Logo" />
          </div>
        </Group>
        {links}
      </div>

      <div className={classes.footer}>
        <a
          className={classes.link}
          href="/notifications"
          onClick={(event) => {
            event.preventDefault();
          }}
        >
          <img
            src="icons/notifications-icon.svg"
            alt="notifications icons"
            className={classes.linkIcon}
            width={24}
            height={24}
          />
          <span>Notifications</span>
        </a>
      </div>
    </nav>
  );
}
