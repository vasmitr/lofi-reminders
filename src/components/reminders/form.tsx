"use client";

import { format } from "date-fns";
import { CalendarIcon, Check } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useProxy } from "valtio/utils";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

import state from "@/data/state";
import { useState } from "react";

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
}

export function ProfileForm(props: PropTypes) {
  const $state = useProxy(state);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      notes: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    $state.addReminder({ ...values, dueDate: values.dueDate.toDateString() });
    form.reset();
    props.onSubmit();
  }

  return (
    <Card className="p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-2"
        >
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
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-[120px] self-end" type="submit">
            <Check />
            Add
          </Button>
        </form>
      </Form>
    </Card>
  );
}

export function ReminderForm() {
  const [open, setOpen] = useState("");

  return (
    <Accordion
      type="single"
      value={open}
      onValueChange={setOpen}
      collapsible
      className="p-2"
    >
      <AccordionItem value="1">
        <AccordionTrigger>Add new reminder</AccordionTrigger>
        <AccordionContent>
          <ProfileForm onSubmit={() => setOpen("")} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
