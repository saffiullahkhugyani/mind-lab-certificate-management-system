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
}

export default function StudentCard({ student, onClick }: StudentCardProps) {
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
  return (
    <div
      className="flex items-center bg-white shadow-md p-4 rounded-md space-x-4 m-2 hover:bg-gray-200 hover:cursor-pointer"
      onClick={onClick}
    >
      {/* Student Image */}
      <Avatar className="w-24 h-24">
        <AvatarImage src={student?.profile_image_url!} alt="@shadcn" />
        <AvatarFallback className="font-bold text-5xl">
          {student?.name?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      {/* Student Information */}
      <div className="flex-grow">
        <h3 className="text-lg font-bold">{student?.name}</h3>
        <p className="text-sm text-gray-600">
          #Programs Interested: {interestMap[student?.id!] || 2}
        </p>
        <p className="text-sm text-gray-600">
          #Programs Done: {doneMap[student?.id!] || 1}
        </p>
        <p className="text-sm text-gray-600">
          Status: {statusMap[student?.id!] || "Progress"}
        </p>
      </div>

      {/* Dropdown Button */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
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
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              console.log(`Cancel support clicked for ${student?.name}`);
            }}
          >
            Cancel Support
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              console.log(`Assign to a program clicked for ${student?.name}`);
            }}
          >
            Assign to a program
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
