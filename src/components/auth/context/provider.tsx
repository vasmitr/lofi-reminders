import { PropsWithChildren, useEffect, useState } from "react";

import "@lo-fi/local-vault/adapter/idb";
import {
  connect,
  rawStorage,
  supportsWebAuthn,
  removeAll,
} from "@lo-fi/local-vault";
import { VaultContext } from "@/components/auth/context/context";

const IDBStore = rawStorage("idb");

export const VaultProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [vault, setVault] = useState<Vault | null>(null);
  const [vaultID, setVaultID] = useState("");
  const [savedUsername, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  const getIDBValue = async (key: string) => {
    if (await IDBStore.has(key)) {
      return await IDBStore.get(key);
    }
  };

  const eraseIdentity = async () => {
    const keys = await IDBStore.keys();
    await IDBStore.remove.many(keys);
    await removeAll();
    location.reload();
  };

  useEffect(() => {
    Promise.all([getIDBValue("vault-id"), getIDBValue("vault-username")]).then(
      ([vaultID, username]) => {
        setVaultID(vaultID);
        setUsername(username);
        setLoading(false);
      }
    );
  }, []);

  async function setup(username?: string) {
    if (!supportsWebAuthn) {
      throw new Error("no support (");
    }

    let _vault;

    try {
      _vault = await connect({
        storageType: "idb",
        addNewVault: !vaultID,
        keyOptions: {
          username: username || savedUsername,
          displayName: username || savedUsername,
        },
        vaultID,
      });
    } catch (e: unknown) {
      if (e instanceof Error) {
        alert(e.message);
      } else {
        alert("An unknown error occurred");
      }
      throw e;
    }

    if (!vaultID && _vault?.id) {
      await IDBStore.set("vault-id", _vault?.id);
      setVaultID(_vault.id);
      if (username || savedUsername) {
        await IDBStore.set("vault-username", username || savedUsername);
        setUsername(username || savedUsername);
      }
    }

    if (!_vault?.id) {
      alert("No vault ID found");
      return;
    }

    setVault(_vault);
  }

  function destroy() {
    vault?.lock();
    setVault(null);
  }

  return (
    <VaultContext.Provider
      value={{
        vault,
        setup,
        destroy,
        eraseIdentity,
        vaultID,
        username: savedUsername,
        loading,
      }}
    >
      {children}
    </VaultContext.Provider>
  );
};
