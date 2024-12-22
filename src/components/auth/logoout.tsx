import { Lock } from "lucide-react";
import { use } from "react";

import { VaultContext } from "@/components/auth/context/context";
import { Button } from "@/components/ui/button";

export default function Logout() {
  const { destroy } = use(VaultContext);

  return (
    <div className="flex justify-end w-full">
      <Button className="bg-red-600 outline" onClick={destroy}>
        Lock <Lock />
      </Button>
    </div>
  );
}
