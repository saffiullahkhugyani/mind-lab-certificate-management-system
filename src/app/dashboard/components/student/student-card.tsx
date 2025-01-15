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
        <p className="text-sm text-gray-600">#Programs Interested: 3</p>
        <p className="text-sm text-gray-600">#Programs Done: 3</p>
        <p className="text-sm text-gray-600">Status: Progress</p>
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
            onClick={() =>
              console.log(`Cancel support clicked for ${student?.name}`)
            }
          >
            Cancel Support
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              console.log(`Assign to a program clicked for ${student?.name}`)
            }
          >
            Assign to a program
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
