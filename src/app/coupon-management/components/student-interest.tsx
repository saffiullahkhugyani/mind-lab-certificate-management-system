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
  const [dataUploaded, setDataUploaded] = useState<StudentInterestData[]>([]);
  const [displayInsertedData, setDisplayInsertedData] =
    useState<boolean>(false);

  // Reference to the file input element
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function saveData() {
    if (!file) {
      toast({
        description: "Please select a file to read and save student interest",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = e.target?.result;
      if (!data) {
        toast({
          description: "Error reading the file. Please try again.",
          variant: "destructive",
        });
        return;
      }

      try {
        // Parse Excel file
        const workBook = XLSX.read(data, { type: "binary" });
        const sheetName = workBook.SheetNames[0];
        const workSheet = workBook.Sheets[sheetName];

        // Convert worksheet to JSON
        const rawJson =
          XLSX.utils.sheet_to_json<Record<string, any>>(workSheet);
        let formattedData = formatRawData(rawJson);

        // removing duplication before insertion
        const preProcessedData = removeDuplicates(formattedData!);

        // Update state
        setRawJsonData(JSON.stringify(rawJson, null, 2));
        setInterestData(preProcessedData);

        // Process and save data
        const processedData = processStudentInterestData(preProcessedData);

        // Start processing data with transitions
        startTransition(async () => {
          const result = await AddStudentInterest(processedData);

          if (result.success) {
            setDisplayInsertedData(true);
            setInterestData(result.data!);

            toast({
              description: `Student interest proccess completed ${result.summary?.successCount} record added`,
              variant:
                result.summary?.successCount! > 0 ? "success" : "destructive",
            });
          } else {
            toast({
              description: "An Error occured while inserting the data",
              variant: "destructive",
            });
          }
        });
      } catch (error) {
        console.error("Error processing the file:", error);
        toast({
          description: "An error occurred while processing the file.",
          variant: "destructive",
        });
      }
    };

    // Read the file as ArrayBuffer
    reader.readAsArrayBuffer(file);
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
  function processStudentInterestData(data: StudentInterestData[]) {
    return data
      .filter((studentData) => {
        // skip if email is null
        if (!studentData.email || !studentData.club) return false;

        // skip  if program is provided but does not  belong to the given club
        if (studentData.program) {
          const club = clubs.find(
            (c) =>
              c.club_name?.toLowerCase() === studentData.club?.toLowerCase()
          );

          if (!club) return false; // club not found

          const program = programs.find(
            (p) =>
              p.program_english_name?.toLowerCase() ===
                studentData.program?.toLowerCase() && p.club_id === club.club_id
          );

          if (!program) return false; // program exist but the club is different
        }

        // pass all the checks
        return true;
      })
      .map((studentInterest) => {
        const clubId = clubs.find(
          (club) =>
            club.club_name?.toLowerCase() ===
            studentInterest.club?.toLowerCase()
        )?.club_id;

        const programId = programs.find(
          (program) =>
            program.program_english_name?.toLowerCase() ===
            studentInterest.program?.toLowerCase()
        )?.program_id;

        return {
          email: studentInterest.email || null,
          user_email: studentInterest.email || null,
          club_id: clubId || null,
          club: studentInterest.club || null,
          program: studentInterest.program || null,
          program_id: programId || null,
          date_submitted: studentInterest.date_submitted || null,
        };
      });
  }

  function removeDuplicates(data: StudentInterestData[]) {
    const seen = new Set();
    const filteredData = data.filter((item) => {
      // Create a composite key based on the specified keys
      const compositeKey = `${item.email}-${item.club}-${item.program}`;
      if (seen.has(compositeKey)) {
        return false; // Duplicate, exclude from the result
      }
      seen.add(compositeKey);
      return true; // Not a duplicate, include in the result
    });

    return filteredData;
  }

  // Function to clear uploaded data
  function clearData() {
    setDisplayInsertedData(false);
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
        <div className="flex items-end gap-6">
          <LoadingButton
            loading={isPending}
            variant="default"
            onClick={saveData}
          >
            Save data
          </LoadingButton>
          <Button variant="destructive" onClick={clearData} className="h-10">
            Clear data
          </Button>
        </div>
      </div>

      {/* Displaying the data table */}
      <div>
        {displayInsertedData && (
          <DataTable columns={columns} data={interestData} />
        )}
      </div>
    </div>
  );
}
