import { use, useState } from "react";

import { VaultContext } from "@/components/auth/context/context";
import { Button } from "@/components/ui/button";
import { Eraser, Fingerprint } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";

export default function LoginButton() {
  const [username, setUsername] = useState("");
  const {
    setup,
    eraseIdentity,
    username: savedUsername,
    vaultID,
    loading,
  } = use(VaultContext);

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
      {!loading && (
        <Card className="p-8 rounded-none border-none shadow-md">
          <CardTitle className="text-center">
            <h1>{savedUsername ? `Hi ${savedUsername}!` : "Welcome!"}</h1>
            {vaultID && (
              <div className="mt-1 text-slate-300 text-xs font-normal">
                ({vaultID})
              </div>
            )}
          </CardTitle>
          <CardContent className="w-full flex justify-center p-4">
            {!savedUsername && (
              <div className="">
                <Input
                  className="w-60 text-center"
                  value={username}
                  onChange={handleChange}
                  placeholder={"Pick username"}
                />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col items-center gap-4">
            <Button
              className="w-[150px] mt-4 bg-blue-100 text-cyan-800 hover:bg-blue-200 hover:text-cyan-900"
              variant="ghost"
              onClick={handleLogin}
              disabled={!savedUsername && !username}
            >
              Login <Fingerprint />
            </Button>
            {savedUsername && (
              <Button
                className="w-[150px]"
                variant="secondary"
                onClick={handleErase}
              >
                Clear my data
                <Eraser />
              </Button>
            )}
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
