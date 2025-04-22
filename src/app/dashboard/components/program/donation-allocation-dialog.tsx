import React, { Dispatch, SetStateAction, useEffect } from "react";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import { Clubs, Programs } from "@/types/types";

interface DonationAllocationDialogProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onConfirmAllocation: (data: FormFields) => Promise<void>;
  isProcessing: boolean;
  selectedClub: Clubs;
  selectedProgram: Programs;
  availableAmount: number;
}

const DonationFormSchema = z.object({
  club_id: z.number(),
  program_id: z.number(),
  amount: z.coerce
    .number()
    .min(1, { message: "Amount must be greater than 0." }),
});

type FormFields = z.infer<typeof DonationFormSchema>;

export default function DonationAllocationDialog({
  isOpen,
  setIsOpen,
  onConfirmAllocation,
  isProcessing,
  selectedClub,
  selectedProgram,
  availableAmount,
}: DonationAllocationDialogProps) {
  const form = useForm<FormFields>({
    resolver: zodResolver(DonationFormSchema),
    defaultValues: {
      amount: 0,
      club_id: selectedClub.club_id!,
      program_id: selectedProgram.program_id!,
    },
  });

  const { reset } = form;

  useEffect(() => {
    if (isOpen) {
      reset({
        amount: 0,
        club_id: selectedClub.club_id!,
        program_id: selectedProgram.program_id!,
      });
    }
  }, [isOpen, reset, selectedClub.club_id, selectedProgram.program_id]);

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    await onConfirmAllocation({
      ...data,
      club_id: selectedClub.club_id!,
      program_id: selectedProgram.program_id!,
    });
    // setIsOpen(false);
  };

  return (
    <ResponsiveDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Allocate Donation"
      description="Assign a portion of your available donation."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mt-4 space-y-4">
            {/* Available Amount Info */}
            <p className="text-sm text-muted-foreground">
              Available Donation: AED {availableAmount.toLocaleString()}
            </p>

            {/* Selected Club */}
            <div>
              <FormLabel className="text-sm text-foreground">Club</FormLabel>
              <p className="text-base">{selectedClub.club_name}</p>
            </div>

            {/* Selected Program */}
            <div>
              <FormLabel className="text-sm text-foreground">Program</FormLabel>
              <p className="text-base">
                {selectedProgram.program_english_name}
              </p>
            </div>

            {/* Donation Amount */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Donation Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      {...field}
                      min={1}
                      max={availableAmount}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <LoadingButton
                type="submit"
                loading={isProcessing}
                disabled={isProcessing || !form.formState.isValid}
              >
                Allocate
              </LoadingButton>
            </div>
          </div>
        </form>
      </Form>
    </ResponsiveDialog>
  );
}
