"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";

import { ReminderForm } from "@/components/reminders/reminder-form";

interface PropTypes {
  editId: string;
  isOpen: string;
  toggleOpen: (value: "" | "1") => void;
  onClose: () => void;
}

export function InlineEditReminderForm({
  editId,
  isOpen,
  toggleOpen,
  onClose,
}: PropTypes) {
  return (
    <Accordion
      type="single"
      value={isOpen}
      onValueChange={toggleOpen}
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
