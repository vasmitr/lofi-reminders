"use client";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { ReminderForm } from "@/components/reminders/reminder-form";
import { RemindersStore } from "@/data/reminders";

export function InlineCreateReminderForm() {
  const [isOpen, setIsOpen] = useState("");
  const { setCurrentEdit, currentEdit } = RemindersStore;

  useEffect(() => {
    if (currentEdit.value) {
      setIsOpen("");
    }
  }, [currentEdit.value]);

  const onClose = async () => {
    setIsOpen("");
  };

  const handleChange = async (v: string) => {
    if (v === "1" && currentEdit.value) {
      await setCurrentEdit("");
    }
    setIsOpen(v);
  };

  return (
    <Accordion
      type="single"
      value={isOpen}
      onValueChange={handleChange}
      collapsible
      className="w-full"
    >
      <AccordionItem value="1" className="border-none">
        <AccordionTrigger className="p-4 text-cyan-800 bg-blue-200 hover:bg-blue-300 hover:text-cyan-900 hover:no-underline">
          <Plus /> Add reminder
        </AccordionTrigger>

        <AccordionContent className="pb-0 xs:w-full xs:h-full xs:bg-slate-50 sm:h-auto">
          <ReminderForm onSubmit={onClose} onCancel={onClose} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
