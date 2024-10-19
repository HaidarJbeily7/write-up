import { render, screen } from '@testing-library/react';
import { Welcome } from './Welcome';

describe('Welcome component', () => {
  it('renders welcome message', () => {
    render(<Welcome />);
    expect(screen.getByText(/Welcome to/i)).toBeInTheDocument();
  });

  it('renders "Get Started" button', () => {
    render(<Welcome />);
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });

  it('renders "Learn More" button', () => {
    render(<Welcome />);
    expect(screen.getByText('Learn More')).toBeInTheDocument();
  });
});
