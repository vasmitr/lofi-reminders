import { Trash2 } from "lucide-react";
import { RemindersStore } from "@/data/reminders";
import { Reminder } from "@/data/types";
import { Card, CardContent, CardFooter, CardTitle } from "../ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { InlineEditReminderForm } from "@/components/reminders/inline-edit-reminder-form";

interface ReminderProps {
  reminder: Reminder;
}

export default function ReminderCard({ reminder }: ReminderProps) {
  const { editReminder, deleteReminder, setCurrentEdit, currentEdit } =
    RemindersStore;
  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    await editReminder({ isDone: !reminder.isDone, id: reminder.id });
  };

  const handleRemove = async (reminder: Reminder) => {
    await deleteReminder(reminder.id);
  };

  const handleItemClick = () => {
    setCurrentEdit(reminder.id);
  };

  return (
    <Card
      className="rounded-none px-4 pt-8 pb-4 cursor-pointer border-none shadow-md my-[1px]"
      onClick={handleItemClick}
    >
      <CardTitle
        className={cn(
          "text-sm text-slate-800 font-medium flex justify-between w-full",
          reminder.isDone && "line-through"
        )}
      >
        <p>{reminder.title}</p>
      </CardTitle>
      <CardContent
        className={cn(
          "mt-1 p-0 text-sm text-slate-600",
          reminder.isDone && "line-through"
        )}
      >
        <p>{reminder.notes || "Notes"}</p>
      </CardContent>
      <CardFooter className="my-4 p-0 flex items-end justify-end gap-4">
        <Button
          variant="secondary"
          size="sm"
          className="w-[100px] text-slate-800"
          onClick={() => handleRemove(reminder)}
        >
          <Trash2 /> Remove
        </Button>
        <Button
          className={cn(
            "w-[100px] text-slate-600",
            reminder.isDone
              ? "bg-slate-100 hover:bg-slate-200 hover:text-slate-900"
              : "bg-blue-200 text-cyan-800 hover:bg-blue-300 hover:text-cyan-900"
          )}
          size="sm"
          onClick={handleClick}
        >
          {reminder.isDone ? "Undone" : "Done"}
        </Button>
      </CardFooter>

      <div
        className={cn(
          "flex w-full",
          currentEdit.value === reminder.id ? "visible" : "hidden"
        )}
      >
        <InlineEditReminderForm editId={reminder.id} />
      </div>
    </Card>
  );
}
