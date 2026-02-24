import React from "react";
import { Check, ChevronsUpDown, Calendar, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEventHub } from "@/contexts/EventContext";
import { format } from "date-fns";

export function EventSelector() {
  const [open, setOpen] = React.useState(false);
  const { activeEvent, events, setActiveEvent } = useEventHub();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-background/50 border-white/10 hover:bg-white/5 text-white"
        >
          <div className="flex items-center gap-2 truncate">
            <Calendar className="h-4 w-4 text-purple-400" />
            <span className="truncate">
              {activeEvent ? activeEvent.title : "Select Event..."}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0 bg-zinc-950 border-white/10 text-white">
        <Command>
          <CommandInput placeholder="Search event..." className="text-white" />
          <CommandList>
            <CommandEmpty>No event found.</CommandEmpty>
            <CommandGroup>
              {events.map((event) => (
                <CommandItem
                  key={event.id}
                  value={event.title}
                  onSelect={() => {
                    setActiveEvent(event);
                    setOpen(false);
                  }}
                  className="flex flex-col items-start gap-1 py-3 cursor-pointer"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium">{event.title}</span>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        activeEvent?.id === event.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </div>
                  {event.event_date && (
                    <span className="text-xs text-zinc-400">
                      {format(new Date(event.event_date), "PPP")}
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <div className="p-2 border-t border-white/10">
            <Button variant="ghost" className="w-full justify-start gap-2 h-9 text-purple-400 hover:text-purple-300 hover:bg-white/5">
              <Plus className="h-4 w-4" />
              <span>Create New Event</span>
            </Button>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
}