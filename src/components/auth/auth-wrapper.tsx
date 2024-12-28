import { use } from "react";

import LoginButton from "./login";
import { VaultContext } from "@/components/auth/context/context";

import { ReactNode } from "react";

interface PropTypes {
  children: ReactNode;
}

export default function AuthWrapper({ children }: PropTypes) {
  const { vault } = use(VaultContext);

  return (
    <div className="p-4 space-y-4">
      {vault?.id ? <div>{children}</div> : <LoginButton />}
    </div>
  );
}
