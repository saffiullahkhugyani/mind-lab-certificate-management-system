"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { ChangeEvent, useState } from "react";
import ProgramCard from "./program-card";
import { AllocatedProgramData, Clubs, Programs } from "@/types/types";

interface ProgramsTabProps {
  allocatedProgramData: AllocatedProgramData[] | null;
  clubList: Clubs[] | null;
  programList: Programs[] | null;
}

// Helper function to get program name based on program type
const getProgramName = (program: AllocatedProgramData | Programs): string => {
  if ("program_name" in program) {
    return program.program_name || "";
  }
  return program.program_english_name || "";
};

// Updated helper function to get donation amount based on program type
const getDonationAmount = (
  program: AllocatedProgramData | Programs,
  isEnrolled: boolean
): string => {
  if (isEnrolled && "allocated_amount" in program) {
    return program.allocated_amount?.toString() || "0";
  }
  // If not enrolled and it's a Programs type, return 0 since it's not yet allocated
  return "0";
};

const ProgramsTab: React.FC<ProgramsTabProps> = ({
  allocatedProgramData,
  clubList,
  programList,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<string>("enrolled");
  const [selectedClubId, setSelectedClubId] = useState<number | null>(null);
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);

  const imageMap: Record<number, string> = {
    29: "/robotics-program.png",
    30: "/aeronautic-program.png",
    31: "/gravity-race-program.png",
    32: "/little-inventors-program.png",
  };

  const handleSearchProgram = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.trim().toLowerCase());
  };

  const handleSelectClub = (clubId: string) => {
    setSelectedClubId(Number(clubId));
  };

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
  };

  const getFilteredPrograms = () => {
    const isEnrolled = selectedFilter === "enrolled";
    const sourcePrograms = isEnrolled ? allocatedProgramData : programList;

    return sourcePrograms?.filter((program) => {
      const programName = getProgramName(program).toLowerCase();
      const matchesSearchQuery =
        !searchQuery || programName.includes(searchQuery);
      const matchesClubFilter =
        !selectedClubId || program.club_id === selectedClubId;

      // Filter out allocated programs from the program list when showing available programs
      const isNotAllocated = !isEnrolled
        ? !allocatedProgramData?.some(
            (allocated) => allocated.program_id === program.program_id
          )
        : true;

      return matchesSearchQuery && matchesClubFilter && isNotAllocated;
    });
  };

  const handleCardClick = (programId: number) => {
    setExpandedCardId(expandedCardId === programId ? null : programId);
  };

  const filteredPrograms = getFilteredPrograms()?.map((program) => {
    // Find the corresponding allocated program (if exists) to get the count
    const allocatedProgram = allocatedProgramData?.find(
      (allocated) => allocated.program_id === program.program_id
    );

    return (
      <ProgramCard
        key={program.program_id}
        image={imageMap[program.program_id!]}
        title={getProgramName(program)}
        description={program.description!}
        donatedAmount={getDonationAmount(
          program,
          selectedFilter === "enrolled"
        )}
        enrolled={selectedFilter === "enrolled"}
        detailsLink={"https://www.iastem.ae"}
        isExpanded={expandedCardId === program.program_id}
        onClick={() => handleCardClick(program.program_id!)}
        numOfAllocations={allocatedProgram?.allocationDataCount!}
      />
    );
  });

  return (
    <div className="grid space-y-2">
      <div className="bg-white shadow-md p-4 rounded-md space-x-2 space-y-2">
        <p className="text-2xl font-bold">Search</p>
        <div className="grid grid-cols-3">
          <div className="grid space-y-3 p-2">
            <Input
              placeholder="Search by program name"
              onChange={handleSearchProgram}
            />
            <div className="flex items-center space-x-2">
              <Label className="text-md font-bold">Your Contributions</Label>
              <p>Programs Supported: {allocatedProgramData?.length || 0}</p>
            </div>
          </div>
          <div className="grid space-y-3 p-2">
            <div className="flex space-x-4 items-center">
              <Label className="font-bold">Filter by club</Label>
              <Select onValueChange={handleSelectClub}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a club" />
                </SelectTrigger>
                <SelectContent>
                  {clubList?.map((club) => (
                    <SelectItem
                      key={club.club_id}
                      value={club.club_id!.toString()}
                    >
                      {club.club_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex space-x-4 items-center">
              <Label className="font-bold">Filter</Label>
              <RadioGroup
                value={selectedFilter}
                onValueChange={handleFilterChange}
                className="flex space-x-3"
              >
                <div className="flex items-center justify-center space-x-2">
                  <RadioGroupItem value="enrolled" id="r1" />
                  <Label htmlFor="r1">Enrolled</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="request" id="r2" />
                  <Label htmlFor="r2">Request to sponsor</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 justify-items-center p-4 rounded-md shadow-md bg-slate-100">
        {filteredPrograms?.length ? (
          filteredPrograms
        ) : (
          <p>No programs found.</p>
        )}
      </div>
    </div>
  );
};

export default ProgramsTab;
