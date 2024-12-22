import { useProxy } from "valtio/utils";
import state from "./data/reminders";
import ReminderCard from "./components/reminders/card";
import { ReminderFilter } from "./components/reminders/filter";
import { Badge } from "./components/ui/badge";
import { filteredRemindersState } from "./data/reminders";
import { InlineReminderForm } from "@/components/reminders/inline-reminder-form";
import AuthWrapper from "@/components/auth/auth-wrapper";

import useVaultPersistState from "@/components/auth/hooks/use-vault-persist-state";

function App() {
  useVaultPersistState("vault-state", state);
  const $state = useProxy(state);

  const { filteredReminders: reminders } = useProxy(filteredRemindersState);

  return (
    <AuthWrapper>
      <div className="flex items-center justify-center gap-1 mt-8 font-medium text-2xl">
        <h1>Reminders</h1>
        <Badge className="text-xs text-center bg-orange-600">
          {reminders.length}
        </Badge>
      </div>
      <div>
        <ReminderFilter value={$state.filter} onChange={$state.setFilter} />
      </div>
      <div className="mt-8 flex flex-col">
        {reminders.map((r) => (
          <ReminderCard key={r.id} reminder={r} />
        ))}
      </div>
      <div>
        <InlineReminderForm />
      </div>
    </AuthWrapper>
  );
}

export default App;
