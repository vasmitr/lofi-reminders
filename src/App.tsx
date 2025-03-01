import ReminderCard from "./components/reminders/card";
import { ReminderFilter } from "./components/reminders/filter";
import { Badge } from "./components/ui/badge";
import { RemindersStore } from "./data/reminders";
import { Filter } from "@/data/types";
import { InlineCreateReminderForm } from "@/components/reminders/inline-create-reminder-form";
import AuthWrapper from "@/components/auth/auth-wrapper";

import { Card, CardTitle } from "@/components/ui/card";
import Logout from "@/components/auth/logoout";
import { useContext, useEffect } from "react";
import { VaultContext } from "@/components/auth/context/context";
import { isOPFSAvailable } from "@/helpers/opfs";

const {
  filteredReminders: reminders,
  filter,
  setFilter,
  init,
} = RemindersStore;

const load = async () => {
  let adapter;
  if (await isOPFSAvailable()) {
    console.log("Using SQLite");
    const { SQLStoreAdapter } = await import(
      "./data/storage-adapters/sqlite-adapter"
    );
    adapter = new SQLStoreAdapter();
  } else {
    const { IDBStoreAdapter } = await import(
      "./data/storage-adapters/idb-adapter"
    );
    console.log("Using IndexedDB");
    adapter = new IDBStoreAdapter();
  }
  await init(adapter);
};

function App() {
  const { loading } = useContext(VaultContext);

  useEffect(() => {
    document.onvisibilitychange = load;
  }, []);

  useEffect(() => {
    load();
  }, [loading]);

  const handleFilterChange = async (filter: Filter) => {
    await setFilter(filter);
  };

  return (
    <AuthWrapper>
      <div className="z-10 max-w-md mx-auto xs:sticky xs:top-0 xs:shadow-lg md:shadow-none md:static">
        <Card className="max-w-md mx-auto rounded-none bg-blue-100 text-cyan-900 h-[100px] p-4">
          <CardTitle className=" flex justify-between items-baseline">
            <div className="flex gap-2 items-center">
              <h1>Reminders</h1>
              <Badge className="bg-cyan-900 text-xs">
                {reminders.value.length}
              </Badge>
            </div>

            <Logout />
          </CardTitle>
        </Card>
        <Card className="max-w-md mx-auto rounded-none">
          <ReminderFilter value={filter.value} onChange={handleFilterChange} />
        </Card>
        <Card className="max-w-md mx-auto rounded-none">
          <InlineCreateReminderForm />
        </Card>
      </div>
      <div className="max-w-md mx-auto">
        {reminders.value.map((r) => (
          <ReminderCard key={r.id} reminder={r} />
        ))}
      </div>
    </AuthWrapper>
  );
}

export default App;
