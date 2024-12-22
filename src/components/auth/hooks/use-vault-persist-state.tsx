import { VaultContext } from "@/components/auth/context/context";
import { use, useEffect } from "react";
import { subscribe } from "valtio";

export default function useVaultPersistState<T extends object>(
  storageKey: string,
  state: T
) {
  const { vault } = use(VaultContext);
  // const $state = useProxy(state);

  useEffect(() => {
    vault?.has(storageKey).then((notEmpty) => {
      if (notEmpty) {
        vault?.get(storageKey).then((data) => {
          const parsed: T = JSON.parse(data || "{}");
          console.log(parsed);
          for (const [key, value] of Object.entries(parsed)) {
            state[key as keyof T] = value;
          }
        });
      }
    });
  }, [vault, storageKey, state]);

  subscribe(state, async () => {
    await vault?.set(storageKey, JSON.stringify(state));
  });
}
