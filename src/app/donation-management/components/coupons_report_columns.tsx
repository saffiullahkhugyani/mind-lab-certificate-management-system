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
import { Certificate, StudentSupport } from "@/types/types";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<StudentSupport>[] = [
  {
    accessorKey: "id",
    header: () => <div className="tet-right">Sr. No</div>,
    cell: ({ row }) => {
      return <div className="font-medium">{row.index + 1}</div>;
    },
  },
  {
    accessorKey: "student_name",
    header: ({ column }) => (
      <Button
        variant={"ghost"}
        size={"sm"}
        className="-ml-3 h-8 data-[state=open]:bg-accent"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>Student Name</span> <CaretSortIcon className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return <div>{row.getValue("student_name")}</div>;
    },
  },
  {
    accessorKey: "program_name",
    header: ({ column }) => (
      <Button
        variant={"ghost"}
        size={"sm"}
        className="-ml-3 h-8 data-[state=open]:bg-accent"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>Program Name</span> <CaretSortIcon className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return <div>{row.getValue("program_name")}</div>;
    },
  },
  {
    accessorKey: "coupon_duration",
    header: ({ column }) => <div>Coupon Duration</div>,
    cell: ({ row }) => {
      return <div>{row.getValue("coupon_duration")}</div>;
    },
  },

  {
    accessorKey: "num_of_coupons",
    header: ({ column }) => <div>Number of Coupons</div>,
    cell: ({ row }) => {
      return <div>{row.getValue("num_of_coupons")}</div>;
    },
  },

  {
    accessorKey: "coupon_start_date",
    header: ({ column }) => <div>Start Date</div>,
    cell: ({ row }) => {
      return <div>{row.getValue("coupon_start_date")}</div>;
    },
  },

  {
    accessorKey: "coupon_end_date",
    header: ({ column }) => <div>End Date</div>,
    cell: ({ row }) => {
      return <div>{row.getValue("coupon_end_date")}</div>;
    },
  },

  //   {
  //     id: "actions",
  //     enableHiding: false,
  //     cell: ({ row }) => {
  //       return <DataTableRowActions row={row} />;
  //     },
  //   },
];
