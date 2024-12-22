import { use, useState } from "react";

import { VaultContext } from "@/components/auth/context/context";
import { Button } from "@/components/ui/button";
import { Eraser, Fingerprint } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function LoginButton() {
  const [username, setUsername] = useState("");
  const { setup, eraseIdentity, username: savedUsername } = use(VaultContext);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleLogin = () => {
    setup?.(username);
  };

  const handleErase = () => {
    eraseIdentity?.();
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <Card>
        <CardTitle className="flex justify-end">
          <Button variant="secondary" size="icon" onClick={handleErase}>
            <Eraser />
          </Button>
        </CardTitle>
        <CardContent className="flex flex-col items-center justify-center w-[300px] h-[200px]">
          <Input
            className={cn(
              "w-60 text-center",
              savedUsername && "border-none disabled:opacity-100"
            )}
            value={savedUsername ? `Hi ${savedUsername}` : username}
            onChange={handleChange}
            placeholder="Pick Username"
            disabled={!!savedUsername}
          />
          <Button className="mt-4" onClick={handleLogin} size="lg">
            Login <Fingerprint />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
