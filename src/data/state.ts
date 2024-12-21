import { proxy } from "valtio";
import remindersSlice from "./reminders";

const state = proxy({
  ...remindersSlice,
});

export default state;
