import ReactDOM from 'react-dom/client';
import App from './App';
import { WalletProvider } from './WalletContext';

import '@near-wallet-selector/modal-ui/styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <WalletProvider>
    <App />
  </WalletProvider>
);
