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
import React, { useRef } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useReactToPrint } from "react-to-print";
import { Printer, Share } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const contentRef = useRef<HTMLDivElement>(null);

  // print coupons report
  const couponsReportPrint = useReactToPrint({ contentRef });

  // download coupons report via pdf
  const handleDownloadPdf = async () => {
    const element = contentRef.current;
    if (!element) {
      return;
    }

    const canvas = await html2canvas(element, {
      backgroundColor: "#ffffff", // Force white background
      scale: 2, // Better quality
    });
    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: "a4",
    });

    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("Coupons_Report");
  };

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

  return (
    <div>
      <div className="m-4 p-4 shadow-md rounded-md bg-white space-y-2">
        <p className="font-bold">Search Certificate</p>
        <div className="flex gap-4 p-4">
          <div className="w-full">
            <Label>Sponsor Name</Label>
            <Input
              placeholder="sponsor name..."
              value={
                (table.getColumn("sponsor_name")?.getFilterValue() as string) ??
                ""
              }
              onChange={(event) =>
                table
                  .getColumn("sponsor_name")
                  ?.setFilterValue(event.target.value)
              }
            />
          </div>
          <div className="w-full">
            <Label>Student Name</Label>
            <Input
              placeholder="Student name..."
              value={
                (table.getColumn("student_name")?.getFilterValue() as string) ??
                ""
              }
              onChange={(event) =>
                table
                  .getColumn("student_name")
                  ?.setFilterValue(event.target.value)
              }
            />
          </div>
          <div className="w-full">
            <Label>Program Name</Label>
            <Input
              placeholder="Program name..."
              value={
                (table.getColumn("program_name")?.getFilterValue() as string) ??
                ""
              }
              onChange={(event) =>
                table
                  .getColumn("program_name")
                  ?.setFilterValue(event.target.value)
              }
            />
          </div>
          {/* <div className="w-full">
            <Label>Issue Year</Label>
            <Input
              placeholder="Issue year..."
              value={
                (table.getColumn("issue_year")?.getFilterValue() as string) ??
                ""
              }
              onChange={(event) =>
                table
                  .getColumn("issue_year")
                  ?.setFilterValue(event.target.value)
              }
            />
          </div> */}
        </div>
        <div className="flex justify-end p-2 space-x-2">
          <Button variant={"outline"} onClick={() => couponsReportPrint()}>
            <Printer color="#286e34" />
          </Button>
          <Button variant={"outline"} onClick={handleDownloadPdf}>
            <Share />
          </Button>
        </div>
      </div>
      <div
        className="m-4 p-4 shadow-md rounded-md border bg-white"
        ref={contentRef}
      >
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
                <TableRow
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
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-center space-x-2 m-4 flex-wrap">
        <Button
          variant="secondary"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>

        {/* Page Numbers */}
        {Array.from({ length: table.getPageCount() }).map((_, index) => {
          const page = index;
          const isCurrent = page === table.getState().pagination.pageIndex;

          return (
            <Button
              key={page}
              variant={isCurrent ? "default" : "outline"}
              onClick={() => table.setPageIndex(page)}
              className={isCurrent ? "font-bold" : ""}
            >
              {page + 1}
            </Button>
          );
        })}

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
