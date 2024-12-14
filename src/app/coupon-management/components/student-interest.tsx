"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clubs, Programs, StudentInterestData, Profiles } from "@/types/types";
import { useRef, useState, useTransition } from "react";
import * as XLSX from "xlsx";
import { AddStudentInterest } from "../actions";
import { LoadingButton } from "@/components/ui/loading-button";
import { DataTable } from "./table-data";
import { columns } from "./data-columns";
import { toast } from "@/components/ui/use-toast";

interface StudentInterestProps {
  students: Profiles[];
  clubs: Clubs[];
  programs: Programs[];
}

export function StudentInterest({
  students,
  clubs,
  programs,
}: StudentInterestProps) {
  const [file, setFile] = useState<File | null>(null);
  const [interestData, setInterestData] = useState<StudentInterestData[]>([]);
  const [rawJsonData, setRawJsonData] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  // Reference to the file input element
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Function to handle file reading and data extraction
  function readDataFromFile() {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        if (data) {
          const workBook = XLSX.read(data, { type: "binary" });
          const sheetName = workBook.SheetNames[0];
          const workSheet = workBook.Sheets[sheetName];

          // Convert worksheet to JSON
          const rawJson: Array<Record<string, any>> =
            XLSX.utils.sheet_to_json(workSheet);

          const formattedData = formatRawData(rawJson);
          setRawJsonData(JSON.stringify(rawJson, null, 2));
          setInterestData(formattedData);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }

  // Function to format raw Excel data into the expected structure
  function formatRawData(rawJson: Array<Record<string, any>>) {
    return rawJson.map((row) => ({
      email: row["email"] || null,
      club: row["club"] || null,
      program: row["program"] || null,
      date_submitted: row["date_submitted"]
        ? XLSX.SSF.format("yyyy-mm-dd", row["date_submitted"])
        : null,
    }));
  }

  // Function to process student interest data and prepare it for insertion
  function processStudentInterestData() {
    return interestData.map((studentInterest) => {
      const clubId = clubs.find(
        (club) =>
          club.club_name?.toLowerCase() === studentInterest.club?.toLowerCase()
      )?.club_id;

      const programId = programs.find(
        (program) =>
          program.program_english_name?.toLowerCase() ===
          studentInterest.program?.toLowerCase()
      )?.program_id;

      return {
        user_email: studentInterest.email || null,
        club_id: clubId || null,
        program_id: programId || null,
        date_submitted: studentInterest.date_submitted || null,
      };
    });
  }

  // Function to save student interest data
  async function saveData() {
    startTransition(async () => {
      if (interestData.length > 0) {
        const processedData = processStudentInterestData();

        const result = await AddStudentInterest(processedData);

        // Display success or error messages via toast
        // Show toasts sequentially with a slight delay
        for (let i = 0; i < result.messages.length; i++) {
          const message = result.messages[i];

          // Display a toast based on whether it's an error or success
          setTimeout(() => {
            if (message.includes("Error")) {
              toast({
                description: message,
                variant: "destructive", // For errors
              });
            } else {
              toast({
                description: message,
                variant: "success", // For success
              });
            }
          }, i * 500); // 300ms delay between each toast
        }
        // result.messages.forEach((message) => {
        //   if (message.includes("Error")) {
        //     toast({
        //       description: message,
        //       variant: "destructive",
        //     });
        //   } else {
        //     toast({
        //       description: message,
        //       variant: "success",
        //     });
        //   }
        // });

        // if (result.success) {
        //   toast({
        //     description: result.message,
        //     variant: "success",
        //   });
        // } else {
        //   toast({
        //     description: result.message,
        //     variant: "destructive",
        //   });
        // }
      } else {
        toast({
          description: "Please select a file to read and save student interest",
          variant: "destructive",
        });
      }
    });
  }

  // Function to clear uploaded data
  function clearData() {
    setInterestData([]);
    setRawJsonData("");
    setFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <div>
      {/* Buttons */}
      <div className="flex gap-8">
        <div className="grid space-y-2">
          <Label className="text-md">Upload file</Label>
          <Input
            ref={fileInputRef}
            type="file"
            accept=".xls, .xlsx"
            onChange={(e) => setFile(e.target.files![0])}
          />
        </div>
        <div className="flex items-end gap-8">
          <Button variant="outline" onClick={readDataFromFile}>
            Preview data
          </Button>
          <LoadingButton
            loading={isPending}
            variant="default"
            onClick={saveData}
          >
            Save data
          </LoadingButton>
          <Button variant="destructive" onClick={clearData}>
            Clear data
          </Button>
        </div>
      </div>

      {/* Displaying the data table */}
      <div>
        {interestData.length > 0 && (
          <DataTable columns={columns} data={interestData} />
        )}
      </div>
    </div>
  );
}
