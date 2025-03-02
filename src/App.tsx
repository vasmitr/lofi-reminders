import { useProxy } from "valtio/utils";
import state from "./data/reminders";
import ReminderCard from "./components/reminders/card";
import { ReminderFilter } from "./components/reminders/filter";
import { Badge } from "./components/ui/badge";
import { filteredRemindersState } from "./data/reminders";
import { InlineCreateReminderForm } from "@/components/reminders/inline-create-reminder-form";
import AuthWrapper from "@/components/auth/auth-wrapper";

import useVaultPersistState from "@/components/auth/hooks/use-vault-persist-state";
import { Card, CardTitle } from "@/components/ui/card";
import Logout from "@/components/auth/logoout";

function App() {
  useVaultPersistState("vault-state", state);
  const $state = useProxy(state);

  const { filteredReminders: reminders } = useProxy(filteredRemindersState);

  return (
    <AuthWrapper>
      <div className="z-10 max-w-md mx-auto xs:sticky xs:top-0 xs:shadow-lg md:shadow-none md:static">
        <Card className="max-w-md mx-auto rounded-none bg-blue-100 text-cyan-900 h-[100px] p-4">
          <CardTitle className=" flex justify-between items-baseline">
            <div className="flex gap-2 items-center">
              <h1>Reminders</h1>
              <Badge className="bg-cyan-900 text-xs">
                {$state.reminders.length}
              </Badge>
            </div>

            <Logout />
          </CardTitle>
        </Card>
        <Card className="max-w-md mx-auto rounded-none">
          <ReminderFilter value={$state.filter} onChange={$state.setFilter} />
        </Card>
        <Card className="max-w-md mx-auto rounded-none">
          <InlineCreateReminderForm />
        </Card>
      </div>
      <div className="max-w-md mx-auto">
        {reminders.map((r) => (
          <ReminderCard key={r.id} reminder={r} />
        ))}
      </div>
    </AuthWrapper>
  );
}

export default App;
