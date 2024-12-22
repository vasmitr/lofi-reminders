"use client";

import { useProxy } from "valtio/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { ReminderForm } from "@/components/reminders/reminder-form";
import { useState, useEffect } from "react";
import state from "@/data/reminders";

interface PropTypes {
  editId?: string;
}

export function InlineReminderForm({ editId }: PropTypes) {
  const $state = useProxy(state);
  const [isOpen, setIsOpen] = useState("");

  useEffect(() => {
    setIsOpen(editId === $state.currentEdit ? "1" : "");
  }, [editId, $state.currentEdit]);

  return (
    <Accordion
      type="single"
      value={isOpen}
      onValueChange={setIsOpen}
      collapsible
      className="mt-8 p-2 w-full"
    >
      <AccordionItem value="1" className="border-none">
        {!editId && <AccordionTrigger>Add reminder</AccordionTrigger>}
        <AccordionContent>
          <ReminderForm onSubmit={() => setIsOpen("")} editId={editId} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
