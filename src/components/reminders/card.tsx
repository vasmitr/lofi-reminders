import { Trash2 } from "lucide-react";
import { useProxy } from "valtio/utils";
import { Reminder, state } from "@/data/reminders";
import { Card, CardContent, CardFooter, CardTitle } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";
import { Button } from "@/components/ui/button";
import { InlineReminderForm } from "@/components/reminders/inline-reminder-form";
import { cn } from "@/lib/utils";

interface ReminderProps {
  reminder: Reminder;
}

export default function ReminderCard({ reminder }: ReminderProps) {
  const $state = useProxy(state);
  const handleCheck = (reminder: Reminder) => {
    $state.toggleIsDone(reminder.id);
  };

  const handleRemove = (reminder: Reminder) => {
    $state.deleteReminder(reminder.id);
  };

  const handleItemClick = () => {
    $state.setCurrentEdit(reminder.id);
  };

  return (
    <Card
      className="rounded-none px-2 py-2 cursor-pointer"
      onClick={handleItemClick}
    >
      <CardTitle className="text-xs font-normal text-gray-800 flex justify-between w-full">
        <p>{reminder.title}</p>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-muted-foreground hover:text-red-500"
          onClick={() => handleRemove(reminder)}
        >
          <Trash2 />
        </Button>
      </CardTitle>
      <CardContent className="p-0 flex justify-between text-gray-400 text-xs">
        <p>{reminder.notes || "Notes"}</p>
        <Checkbox
          className="mt-2 mr-2"
          checked={reminder.isDone}
          onCheckedChange={() => handleCheck(reminder)}
        />
      </CardContent>
      <CardFooter className="mt-4 p-0 flex justify-between text-gray-400 text-xs">
        <div className="flex gap-1">
          {reminder.tags?.map((tag) => (
            <Badge key={tag} className="bg-cyan-800">
              {tag}
            </Badge>
          ))}
        </div>
        <Badge className="bg-slate-600">
          {new Date(reminder.dueDate).toLocaleDateString()}
        </Badge>
      </CardFooter>

      <div
        className={cn(
          "flex w-full",
          $state.currentEdit === reminder.id ? "visible" : "hidden"
        )}
      >
        <InlineReminderForm editId={reminder.id} />
      </div>
    </Card>
  );
}
