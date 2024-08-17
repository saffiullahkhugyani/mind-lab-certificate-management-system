"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  getFilteredRowModel,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Certificate } from "@/types/types";

interface DataTableProps {
  columns: ColumnDef<Certificate>[];
  data: Certificate[];
  searchInitial: string;
  onAddCertificate: (row: Certificate | null) => void;
}

export function DataTable({
  columns,
  data,
  searchInitial,
  onAddCertificate,
}: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([
    { id: "issue_authority", value: searchInitial },
  ]);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      columnFilters,
      sorting,
    },
  });

  const toggleRowDetails = (rowId: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  };

  return (
    <div>
      <div className="flex gap-4 p-4">
        <div className="w-full">
          <Label>Issue Authority</Label>
          <Input
            placeholder="Issue authority..."
            value={
              (table
                .getColumn("issue_authority")
                ?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table
                .getColumn("issue_authority")
                ?.setFilterValue(event.target.value)
            }
          />
        </div>
        <div className="w-full">
          <Label>Certificate Name</Label>
          <Input
            placeholder="Certificate name..."
            value={
              (table
                .getColumn("certificate_name_english")
                ?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table
                .getColumn("certificate_name_english")
                ?.setFilterValue(event.target.value)
            }
          />
        </div>
        <div className="w-full">
          <Label>Issue Year</Label>
          <Input
            placeholder="Issue year..."
            value={
              (table.getColumn("issue_year")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("issue_year")?.setFilterValue(event.target.value)
            }
          />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <>
                  <TableRow
                    onClick={() => toggleRowDetails(row.id)}
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  {expandedRows[row.id] && (
                    <TableRow>
                      <TableCell>
                        <div className="p-4 space-y-2">
                          <div className=" flex items-center justify-center ps-2 2mb-2 font-semibold text-md border border-black rounded-lg bg-white">
                            Details
                          </div>
                          <div className="mb-2">
                            Skill Level: {row.original.skill_level}
                          </div>
                          <div className="mb-2">
                            Skills Type: {row.original.skill_type}
                          </div>
                          <div className="mb-2">Tags: {row.original.tags}</div>
                          <Button
                            onClick={() => onAddCertificate(row.original)}
                            className="mt-2 rounded-lg"
                          >
                            Add Certificate
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex flex-col justify-center items-center space-y-2 p-4">
                    <span>No results.</span>
                    <Button
                      variant={"outline"}
                      onClick={() => onAddCertificate(null)}
                    >
                      Add new certificate
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className=" flex otems-center justify-center space-x-2 m-4">
        <Button
          variant="secondary"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="secondary"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
