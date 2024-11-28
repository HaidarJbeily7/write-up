// @ts-nocheck
import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { setupBitgetWallet } from '@near-wallet-selector/bitget-wallet';
import { setupCoin98Wallet } from '@near-wallet-selector/coin98-wallet';
import { NetworkId, setupWalletSelector, WalletSelector } from '@near-wallet-selector/core';
import { setupHereWallet } from '@near-wallet-selector/here-wallet';
import { setupLedger } from '@near-wallet-selector/ledger';
import { setupMathWallet } from '@near-wallet-selector/math-wallet';
import { setupMeteorWallet } from '@near-wallet-selector/meteor-wallet';
import { setupModal, WalletSelectorModal } from '@near-wallet-selector/modal-ui';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';
import { setupNarwallets } from '@near-wallet-selector/narwallets';
import { setupNearFi } from '@near-wallet-selector/nearfi';
import { setupNeth } from '@near-wallet-selector/neth';
import { setupNightly } from '@near-wallet-selector/nightly';
import { setupSender } from '@near-wallet-selector/sender';
import { setupXDEFI } from '@near-wallet-selector/xdefi';
import { useUserStore } from '@/store/user';

interface WalletContextValue {
  selector: WalletSelector | null;
  modal: WalletSelectorModal | null;
  accountId: string | null;
  setAccountId: (accountId: string | null) => void;
}

export const WalletContext = createContext<WalletContextValue>({
  selector: null,
  modal: null,
  accountId: null,
  setAccountId: () => {},
});

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [selector, setSelector] = useState<WalletSelector | null>(null);
  const [modal, setModal] = useState<WalletSelectorModal | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const { setIsLoggedIn } = useUserStore();
  useEffect(() => {
    const init = async () => {
      const _selector = await setupWalletSelector({
        network: 'testnet' as NetworkId,

        modules: [
          setupMyNearWallet(),
          setupBitgetWallet(),
          setupSender(),
          setupHereWallet(),
          setupMathWallet(),
          setupNightly(),
          setupMeteorWallet(),
          setupNarwallets(),
          setupLedger(),
          setupNearFi(),
          setupCoin98Wallet(),
          setupNeth(),
          setupXDEFI(),
        ],
      });

      const _modal = setupModal(_selector, {
        contractId: 'placeholder.testnet',
      });

      setSelector(_selector);
      setModal(_modal);

      const accounts = await _selector.store.getState().accounts;
      if (accounts.length > 0) {
        setAccountId(accounts[0].accountId);
        localStorage.setItem('near_account_id', accounts[0].accountId);
      }
    };

    init().catch((err) => {
      throw new Error(`Error: ${err instanceof Error ? err.message : err}`);
    });
  }, []);

  useEffect(() => {
    if (selector) {
      const subscription = selector.store.observable.subscribe((state) => {
        const accounts = state.accounts;
        if (accounts.length > 0) {
          setAccountId(accounts[0].accountId);
          localStorage.setItem('near_account_id', accounts[0].accountId);
          const alreadyRedirected = localStorage.getItem('already_redirected');
          setIsLoggedIn(true);
          if (!alreadyRedirected) {
            localStorage.setItem('already_redirected', 'true');
            window.location.href = '/dashboard';
          }
        } else {
          setAccountId(null);
          localStorage.removeItem('near_account_id');
        }
      });

      return () => subscription.unsubscribe();
    }
  }, [selector]);

  return (
    <WalletContext.Provider value={{ selector, modal, accountId, setAccountId }}>
      {children}
    </WalletContext.Provider>
  );
};
