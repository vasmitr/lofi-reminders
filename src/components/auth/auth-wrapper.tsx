import { useContext } from "react";

import LoginButton from "./login";
import { VaultContext } from "@/components/auth/context/context";

import { ReactNode } from "react";

interface PropTypes {
  children: ReactNode;
}

export default function AuthWrapper({ children }: PropTypes) {
  const { vault } = useContext(VaultContext);

  return (
    <div className="">
      {vault?.id ? <div>{children}</div> : <LoginButton />}
    </div>
  );
}
