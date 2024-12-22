"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { useState } from "react";
import { ReminderForm } from "@/components/reminders/reminder-form";

export function InlineReminderForm() {
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
          <ReminderForm onSubmit={() => setOpen("")} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
