"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";

import { ReminderForm } from "@/components/reminders/reminder-form";
import { useState, useEffect } from "react";
import state from "@/data/reminders";
import { useProxy } from "valtio/utils";

interface PropTypes {
  editId: string;
}

export function InlineEditReminderForm({ editId }: PropTypes) {
  const [isOpen, setIsOpen] = useState("");
  const $state = useProxy(state);

  useEffect(() => {
    setIsOpen($state.currentEdit === editId ? "1" : "");
  }, [$state.currentEdit, editId, setIsOpen]);

  const onClose = async () => {
    $state.setCurrentEdit("");
  };

  return (
    <Accordion
      type="single"
      value={isOpen}
      onValueChange={setIsOpen}
      collapsible
      className="w-full"
    >
      <AccordionItem value="1" className="border-none">
        <AccordionContent className="pb-0 xs:w-full xs:h-full xs:bg-slate-50">
          <ReminderForm onSubmit={onClose} onCancel={onClose} editId={editId} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
