"use client";

import { format } from "date-fns";
import { CalendarIcon, Check, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useProxy } from "valtio/utils";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import state from "@/data/reminders";

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title is required",
  }),
  notes: z.string(),
  dueDate: z.date({
    message: "Due Date is required",
  }),
});

interface PropTypes {
  onSubmit: () => void;
  editId?: string;
}

export function ReminderForm(props: PropTypes) {
  const $state = useProxy(state);

  const reminder = $state.reminders.find((r) => r.id === props.editId);

  const defaultValues = reminder
    ? {
        title: reminder.title,
        notes: reminder.notes || "",
        dueDate: new Date(reminder.dueDate),
      }
    : {
        title: "",
        notes: "",
        dueDate: new Date(),
      };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (props.editId) {
      $state.updateReminder({
        id: props.editId,
        ...values,
        dueDate: values.dueDate.toDateString(),
      });
    } else {
      $state.addReminder({ ...values, dueDate: values.dueDate.toDateString() });
    }

    form.reset();
    props.onSubmit();
  }

  function handleCancel(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    $state.setCurrentEdit("");
  }

  return (
    <Card className={cn("p-4", props.editId && "bg-muted")}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-2"
        >
          {props.editId && (
            <Button onClick={handleCancel} variant="ghost" className="self-end">
              <X />
            </Button>
          )}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className="border-none"
                    placeholder="Title"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    className="border-none"
                    placeholder="Notes"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col self-end">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[120px] pl-3 text-left font-normal self-end",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "P")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      autoFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-[120px] self-end" type="submit">
            <Check />
            {props.editId ? "Update" : "Add"}
          </Button>
        </form>
      </Form>
    </Card>
  );
}
