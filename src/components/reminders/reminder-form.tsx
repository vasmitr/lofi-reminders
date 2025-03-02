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
  onCancel: () => void;
  editId?: string;
}

export function ReminderForm(props: PropTypes) {
  const $state = useProxy(state);

  const reminder = $state.reminders.find((r) => r.id === props.editId);

  const defaultValues = reminder
    ? {
        title: reminder.title,
        notes: reminder.notes || "",
        dueDate: new Date(reminder.dueDate as string),
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const input = {
      ...values,
      dueDate: values.dueDate.toDateString(),
    };
    if (props.editId) {
      $state.updateReminder({ ...input, id: props.editId });
    } else {
      $state.addReminder(input);
    }

    form.reset();
    props.onSubmit();
  }

  async function handleCancel(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    form.reset();
    props.onCancel();
  }

  return (
    <Card
      className={cn(
        "rounded-none drop-shadow-sm shadow-lg p-8  border-0 bg-slate-50",
        props.editId && "border-blue-300 border-t-8"
      )}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Title" {...field} />
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
                  <Textarea placeholder="Notes" {...field} />
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
                        variant="ghost"
                        className={cn(
                          "w-[120px] pl-3 text-left font-normal self-end border-b-2 border-b-slate-400",
                          "rounded-none hover:text-secondary-foreground hover:bg-secondary hover:border-b-primary",
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
          <div className="mt-4 flex justify-end gap-4">
            <Button
              onClick={handleCancel}
              variant="secondary"
              size="lg"
              className="bg-slate-400 text-white hover:bg-slate-500"
            >
              <X />
              Cancel
            </Button>
            <Button
              size="lg"
              className="w-[120px] self-end bg-blue-500 text-cyan-50 hover:bg-blue-600"
              type="submit"
            >
              <Check />
              {props.editId ? "Update" : "Add"}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
