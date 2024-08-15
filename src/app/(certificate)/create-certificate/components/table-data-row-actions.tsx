"use client";
import IconMenu from "@/components/icon-menu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Row } from "@tanstack/react-table";
import { CopyPlus, MoreHorizontal, File } from "lucide-react";

interface WithId<T> {
  id: string;
}
interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  onAddCertificate: (certificate: TData) => void;
}

export function DataTableRowActions<TData extends WithId<string>>({
  row,
  onAddCertificate,
}: DataTableRowActionsProps<TData>) {
  const certificateId = row.original.id as string;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px] z-50">
        <DropdownMenuItem className="group flex w-full items-center justify-between  text-left p-0 text-sm font-base text-neutral-500 ">
          <button className="w-full justify-start flex rounded-md p-2 transition-all duration-75 hover:bg-neutral-100">
            <IconMenu text="View Details" icon={<File className="h-4 w-4" />} />
          </button>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="group flex w-full items-center justify-between  text-left p-0 text-sm font-base text-neutral-500 ">
          <button
            onClick={() => {
              onAddCertificate(row.original);
              console.log(certificateId);
            }}
            className="w-full justify-start flex rounded-md p-2 transition-all duration-75 hover:bg-neutral-100"
          >
            <IconMenu
              text="Add Certificate"
              icon={<CopyPlus className="h-4 w-4" />}
            />
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
