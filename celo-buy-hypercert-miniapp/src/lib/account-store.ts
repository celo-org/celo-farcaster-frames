import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AccountType = "eoa" | "safe";

export type Account = {
  type: AccountType;
  address: `0x${string}`;
};

interface AccountState {
  selectedAccount: Account | null;
  setSelectedAccount: (account: Account | null) => void;
}

export const useAccountStore = create<AccountState>()(
  persist(
    (set) => ({
      selectedAccount: null,
      setSelectedAccount: (account) => set({ selectedAccount: account }),
    }),
    {
      name: "selected-account-storage",
    },
  ),
);

export function selectWalletAccount(address: string) {
  useAccountStore.setState({
    selectedAccount: {
      type: "eoa",
      address: address as `0x${string}`,
    },
  });
}


interface StoreState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    hash: any;
    error: null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    emitHash: (newHash: any) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    emitError: (newError: any) => void;
  }

export const useStore = create<StoreState>((set) => ({
  error: null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  emitError: (newError: any) => set({ error: newError }),
  hash: null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  emitHash: (newHash: any) => set({ hash: newHash }),
}));