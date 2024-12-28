import { createContext } from "react";

interface VaultContextType {
  vault: Vault | null;
  setup?: (username?: string) => void;
  destroy?: () => void;
  eraseIdentity?: () => void;
  vaultID?: string;
  username?: string;
  loading?: boolean;
}

export const VaultContext = createContext<VaultContextType>({ vault: null });
