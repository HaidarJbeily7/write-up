import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { theme } from '../../theme';
import { WelcomeInternal } from './WelcomeInternal';

describe('Welcome component', () => {
  it('renders welcome message', () => {
    render(
      <MantineProvider theme={theme}>
        <WelcomeInternal navigate={() => {}} />
      </MantineProvider>
    );
    expect(screen.getByText(/Welcome to/i)).toBeInTheDocument();
  });

  it('renders "Get Started" button', () => {
    render(
      <MantineProvider theme={theme}>
        <WelcomeInternal navigate={() => {}} />
      </MantineProvider>
    );
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });

  it('renders "Learn More" button', () => {
    render(
      <MantineProvider theme={theme}>
        <WelcomeInternal navigate={() => {}} />
      </MantineProvider>
    );
    expect(screen.getByText('Learn More')).toBeInTheDocument();
  });
});
