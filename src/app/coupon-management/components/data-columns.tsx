"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StudentInterestData } from "@/types/types";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<StudentInterestData>[] = [
  {
    accessorKey: "id",
    header: () => <div className="tet-right">Sr. No</div>,
    cell: ({ row }) => {
      return <div className="font-medium">{row.index + 1}</div>;
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant={"ghost"}
        size={"sm"}
        className="-ml-3 h-8 data-[state=open]:bg-accent"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span> Email</span> <CaretSortIcon className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return <div>{row.getValue("email")}</div>;
    },
  },
  {
    accessorKey: "club",
    header: ({ column }) => (
      <Button
        variant={"ghost"}
        size={"sm"}
        className="-ml-3 h-8 data-[state=open]:bg-accent"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>Club</span> <CaretSortIcon className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return <div>{row.getValue("club")}</div>;
    },
  },
  {
    accessorKey: "program",
    header: ({ column }) => (
      <Button
        variant={"ghost"}
        size={"sm"}
        className="-ml-3 h-8 data-[state=open]:bg-accent"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Program <CaretSortIcon className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return <div>{row.getValue("program")}</div>;
    },
  },
  {
    accessorKey: "date_submitted",
    header: ({ column }) => (
      <Button
        variant={"ghost"}
        size={"sm"}
        className="-ml-3 h-8 data-[state=open]:bg-accent"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date Submitted <CaretSortIcon className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return <div>{row.getValue("date_submitted")}</div>;
    },
  },
];
