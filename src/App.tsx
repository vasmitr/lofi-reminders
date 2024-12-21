import { useProxy } from "valtio/utils";
import state from "./data/state";
import ReminderCard from "./components/reminders/card";

function App() {
  const $state = useProxy(state);

  return (
    <div>
      <h1 className="mt-8 text-center font-medium text-2xl">My Notes</h1>
      <div className="mt-8 flex flex-col">
        {$state.reminders.map((r) => (
          <ReminderCard key={r.id} reminder={r} />
        ))}
      </div>
    </div>
  );
}

export default App;
