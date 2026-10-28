"use client";

import { useState } from "react";
import { format, startOfToday } from "date-fns";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function EventDatePicker({ error, onPick }: { error?: string, onPick? : () => void }) {
  const [date, setDate] = useState<Date>();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <label htmlFor="event-date" className="font-display text-2xl">
        When is your event?
      </label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              id="event-date"
              type="button"
              variant="outline"
              data-empty={!date}
              aria-invalid={!!error}
              aria-describedby="event-date-error"
              className="min-h-11 w-full justify-between rounded-full border-border bg-transparent px-5 text-base font-normal text-foreground hover:border-gold hover:bg-transparent aria-invalid:border-destructive data-[empty=true]:text-muted-foreground"
            >
              {date ? format(date, "PPP") : "Pick a date"}
              <ChevronDownIcon data-icon="inline-end" />
            </Button>
          }
        />
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(day) => {
              setDate(day);
              setOpen(false);
              onPick?.()
            }}
            defaultMonth={date}
            disabled={(day) => day < startOfToday()}
          />
        </PopoverContent>
      </Popover>

      {error && (
        <p id="event-date-error" className="px-5 text-sm text-destructive">
          {error}
        </p>
      )}

      {/* The calendar isn't a real input, so this is what the form sends */}
      <input
        type="hidden"
        name="date"
        value={date ? format(date, "yyyy-MM-dd") : ""}
      />
    </div>
  );
}
