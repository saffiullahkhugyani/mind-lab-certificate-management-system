"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
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
import { cn } from "@/lib/utils/utils";

interface SearchableDropdownProps<T> {
  items: T[];
  placeholder?: string;
  buttonClassName?: string;
  onSelect: (item: T) => void;
  getLabel: (item: T) => string;
  getValue: (item: T) => string;
}

export function SearchableDropdown<T>({
  items,
  placeholder = "Search...",
  buttonClassName = "w-full justify-between",
  onSelect,
  getLabel,
  getValue,
}: SearchableDropdownProps<T>) {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState("");
  const [searchQuery, setSearchQuery] = React.useState("");

  const selectedItem = items.find((item) => getValue(item) === selectedValue);

  // Filter items based on search query
  const filteredItems = searchQuery
    ? items.filter((item) =>
        getLabel(item).toLowerCase().includes(searchQuery.trim().toLowerCase())
      )
    : items;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[200px] justify-between", buttonClassName)}
        >
          {selectedItem ? getLabel(selectedItem) : "Select an option..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[500px] p-0">
        <Command>
          <CommandInput
            placeholder={placeholder}
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>No Students found.</CommandEmpty>
            <CommandGroup>
              {filteredItems.map((item) => {
                const value = getValue(item);
                const label = getLabel(item);
                return (
                  <CommandItem
                    key={value}
                    value={label}
                    onSelect={() => {
                      setSelectedValue(value);
                      onSelect(item);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedValue === value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
