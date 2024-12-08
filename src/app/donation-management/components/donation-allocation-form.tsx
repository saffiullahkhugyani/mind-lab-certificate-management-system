"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Programs } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import SuccessNotification from "./success-notification";
import { Input } from "@/components/ui/input";
// import { donationAllocation } from "../actions";
import { toast } from "@/components/ui/use-toast";

// Updated Donation Allocation Form Schema
export const donationAllocationFormSchema = z.object({
  program_id: z.number().int().min(1, "Please select a program"),
  amount: z.number().positive("Amount must be positive"),
});

// Type inference for form fields
type FormFields = z.infer<typeof donationAllocationFormSchema>;

interface DonationAllocationProps {
  programs: Programs[] | null;
}

export default function DonationAllocationForm({
  programs,
}: DonationAllocationProps) {
  const [isPending, startTransition] = useTransition();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Programs>();
  const [submissionDetails, setSubmissionDetails] = useState<{
    id: number;
    programName: string;
    amount: number;
  } | null>(null);

  // initializing form reference from HTML FORM ELEMENT
  const formRef = useRef<HTMLFormElement>(null);

  // Initialize form with react-hook-form
  const form = useForm<FormFields>({
    resolver: zodResolver(donationAllocationFormSchema),
    defaultValues: {},
  });

  const { reset, watch } = form;

  // Handle form submission with explicit typing
  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    console.log("Form Submitted Directly:", data);

    // startTransition(async () => {
    //   const result = await donationAllocation(data);

    //   if (!result.success) {
    //     toast({
    //       description: result.error || "An unexpected error occurred",
    //       variant: "destructive",
    //     });
    //   }

    //   if (result.success) {
    //     setSubmissionDetails({
    //       id: result.data?.at(0)?.id!,
    //       programName:
    //         selectedProgram?.program_english_name || "Unknown Program",
    //       amount: data.amount,
    //     });
    //     setIsSubmitted(true);

    //     reset({
    //       program_id: undefined,
    //       amount: 0,
    //     });
    //   }
    // });
  };

  const handleDismiss = () => {
    setIsSubmitted(false);
    setSubmissionDetails(null);
  };

  // Ensure programs is not null
  if (!programs || programs.length === 0) {
    return <div>No programs available</div>;
  }

  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="program_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Program</FormLabel>
              <Select
                onValueChange={(value) => {
                  // Find the corresponding program when a program is selected
                  const selected = programs.find(
                    (program) => program.program_english_name === value
                  );

                  // setting selected program
                  setSelectedProgram(selected);

                  // Update the form value with the program ID as a number
                  field.onChange(selected?.program_id || 0);
                }}
                value={
                  // Display the program name based on the selected program ID
                  programs.find((program) => program.program_id === field.value)
                    ?.program_english_name || ""
                }
                disabled={programs.length === 0}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Program" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {programs.map((program) => (
                    <SelectItem
                      key={program.program_id}
                      value={program.program_english_name || ""}
                    >
                      {program.program_english_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Allocation Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  className="w-full border p-2"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton type="submit" disabled={isPending}>
          {isPending ? "Allocating..." : "Allocate"}
        </LoadingButton>
      </form>
      {isSubmitted && submissionDetails && (
        <SuccessNotification
          id={submissionDetails.id}
          programName={submissionDetails.programName}
          amount={submissionDetails.amount}
          onDismiss={handleDismiss}
        />
      )}
    </Form>
  );
}
