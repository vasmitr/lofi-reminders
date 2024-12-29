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
import { Plus } from "lucide-react";

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
      className="w-full"
    >
      <AccordionItem value="1" className="border-none">
        {!editId && (
          <AccordionTrigger className="p-4 text-cyan-800 bg-blue-200 hover:bg-blue-300 hover:text-cyan-900 hover:no-underline">
            <Plus /> Add reminder
          </AccordionTrigger>
        )}
        <AccordionContent className="xs:w-full xs:h-screen xs:bg-slate-50 sm:h-auto">
          <ReminderForm onSubmit={() => setIsOpen("")} editId={editId} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
