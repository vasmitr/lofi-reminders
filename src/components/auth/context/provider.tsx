import { PropsWithChildren, useEffect, useState } from "react";

import "@lo-fi/local-vault/adapter/idb";
import { connect, rawStorage, supportsWebAuthn } from "@lo-fi/local-vault";
import { VaultContext } from "@/components/auth/context/context";

const IDBStore = rawStorage("idb");

export const VaultProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [vault, setVault] = useState<Vault | null>(null);
  const [vaultID, setVaultID] = useState("");
  const [savedUsername, setUsername] = useState("");

  const getIDBValue = async (key: string) => {
    if (await IDBStore.has(key)) {
      return await IDBStore.get(key);
    }
  };

  const eraseIdentity = async () => {
    if (await IDBStore.has("vault-id")) {
      const vaultID = await IDBStore.get("vault-id");
      await IDBStore.remove("vault-id");
      await IDBStore.remove("vault-username");
      await IDBStore.remove("local-vault-" + vaultID);
      setVaultID("");
      setUsername("");
      destroy();
    }
  };

  useEffect(() => {
    getIDBValue("vault-id").then((vaultID) => {
      setVaultID(vaultID);
    });
    getIDBValue("vault-username").then((username) => {
      setUsername(username);
    });
  }, []);

  async function setup(username?: string) {
    if (!supportsWebAuthn) {
      throw new Error("no support (");
    }

    let vault;

    try {
      vault = await connect({
        storageType: "idb",
        addNewVault: !vaultID,
        keyOptions: {
          username: savedUsername,
          displayName: savedUsername,
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

    if (!vaultID) {
      await IDBStore.set("vault-id", vault?.id);
      if (username || savedUsername) {
        await IDBStore.set("vault-username", username || savedUsername);
      }
    }

    setVault(vault);
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
      }}
    >
      {children}
    </VaultContext.Provider>
  );
};
