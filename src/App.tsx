import { useProxy } from "valtio/utils" 
import state from "./data/state"

function App() {

  const $state = useProxy(state);

  return (
    <div className="flex flex-col">
      {$state.reminders.map((r) => <div key={r.id}>{r.title}</div>)}
    </div>
  )
}

export default App
