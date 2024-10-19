import { useNavigate } from 'react-router-dom';
import { WelcomeInternal } from './WelcomeInternal';

export function Welcome() {
  const navigate = useNavigate();
  return <WelcomeInternal navigate={navigate} />;
}
