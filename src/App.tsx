import { useProxy } from "valtio/utils";
import state from "./data/reminders";
import ReminderCard from "./components/reminders/card";
import { ReminderFilter } from "./components/reminders/filter";
import { Badge } from "./components/ui/badge";
import { filteredRemindersState } from "./data/reminders";
import { InlineReminderForm } from "@/components/reminders/inline-reminder-form";
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
        <InlineReminderForm />
      </Card>
      <div className="max-w-md mx-auto">
        {reminders.map((r) => (
          <ReminderCard key={r.id} reminder={r} />
        ))}
      </div>
    </AuthWrapper>
  );
}

export default App;
