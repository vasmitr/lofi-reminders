import { Lock } from "lucide-react";
import { use } from "react";

import { VaultContext } from "@/components/auth/context/context";
import { Button } from "@/components/ui/button";

export default function Logout() {
  const { destroy } = use(VaultContext);

  return (
    <Button
      variant="ghost"
      className="hover:bg-blue-200 hover:text-cyan-900"
      onClick={destroy}
    >
      Lock <Lock />
    </Button>
  );
}
