"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Profiles } from "@/types/customs";

interface StudentCardProps {
  student: Profiles | null;
  onClick: () => {};
  onCancelSupportClick: (studentId: string) => void;
  onAssignProgram: (studentId: string) => void;
  totalNumOfCoupons: number | null;
  totalNumOfEnrolledPrograms: number | null;
}

export default function StudentCard({
  student,
  onClick,
  onCancelSupportClick,
  onAssignProgram,
  totalNumOfCoupons,
  totalNumOfEnrolledPrograms,
}: StudentCardProps) {
  const interestMap: Record<string, string> = {
    "4dd82bb4-964c-4b33-b857-b95b17507af0": "2",
    "a2a0d09f-f00d-43ce-9465-59bb4da847c7": "3",
    "993382f4-f490-45ed-b9b6-49142b385e17": "1",
    "6514d0e1-ff55-4296-b880-baa1b7b5bf76": "2",
  };

  const doneMap: Record<string, string> = {
    "4dd82bb4-964c-4b33-b857-b95b17507af0": "1",
    "a2a0d09f-f00d-43ce-9465-59bb4da847c7": "2",
    "993382f4-f490-45ed-b9b6-49142b385e17": "0",
    "6514d0e1-ff55-4296-b880-baa1b7b5bf76": "2",
  };

  const statusMap: Record<string, string> = {
    "4dd82bb4-964c-4b33-b857-b95b17507af0": "Progress",
    "a2a0d09f-f00d-43ce-9465-59bb4da847c7": "Progress",
    "993382f4-f490-45ed-b9b6-49142b385e17": "Not Completed",
    "6514d0e1-ff55-4296-b880-baa1b7b5bf76": "Completed",
  };
  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  return (
    <div
      className="flex flex-col sm:flex-row items-center bg-white shadow-md p-4 rounded-lg space-y-4 sm:space-y-0 sm:space-x-4 m-2 hover:bg-gray-200 hover:cursor-pointer transition-all duration-200 w-full max-w-lg sm:max-w-xl md:max-w-2xl"
      onClick={onClick}
    >
      {/* Student Image */}
      <Avatar className="w-20 h-20 sm:w-24 sm:h-24">
        <AvatarImage src={student?.profile_image_url!} alt={student?.name!} />
        <AvatarFallback className="font-bold text-3xl sm:text-4xl">
          {student?.name?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      {/* Student Information */}
      <div className="flex-grow text-center sm:text-left">
        <h3 className="text-lg font-bold">{student?.name}</h3>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Programs Enrolled:</span>{" "}
          {totalNumOfEnrolledPrograms}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Number of coupons issued:</span>{" "}
          {totalNumOfCoupons}
        </p>
        {/* <p className="text-sm text-gray-600">
          <span className="font-medium">Status:</span>{" "}
          {statusMap[student?.id!] || "Progress"}
        </p> */}
      </div>

      {/* Dropdown Button */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger onClick={handleDropdownClick} asChild>
          <Button
            variant="ghost"
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6h.01M12 12h.01M12 18h.01"
              />
            </svg>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent onClick={handleDropdownClick} align="end">
          <DropdownMenuItem
            onClick={async () => onCancelSupportClick(student?.id!)}
          >
            Cancel Support
          </DropdownMenuItem>
          <DropdownMenuItem onClick={async () => onAssignProgram(student?.id!)}>
            Assign to a program
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
