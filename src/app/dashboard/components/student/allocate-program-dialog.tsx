import React, { Dispatch, SetStateAction, useEffect, useRef } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingButton } from "@/components/ui/loading-button";
import { Profiles } from "@/types/customs";
import { AllocatedProgramData, Programs, Student } from "@/types/types";

interface AllocateProgramDialogProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  selectedStudent: Student | null;
  onConfirmAllocate: (programId: number, studentId: string) => Promise<void>;
  isProcessing: boolean;
  availablePrograms: AllocatedProgramData[] | null;
}

const AllocateSupportFormSchema = z.object({
  program_id: z.coerce.number().min(1, { message: "Please select a program." }),
});

type FormFields = z.infer<typeof AllocateSupportFormSchema>;

export default function AllocateProgramDialog({
  isOpen,
  setIsOpen,
  selectedStudent,
  onConfirmAllocate,
  isProcessing,
  availablePrograms,
}: AllocateProgramDialogProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<FormFields>({
    resolver: zodResolver(AllocateSupportFormSchema),
    defaultValues: { program_id: 0 },
  });

  const { reset, watch, control } = form;
  const selectedProgramId = watch("program_id");

  useEffect(() => {
    if (isOpen) {
      reset({ program_id: 0 });
    }
  }, [isOpen, reset]);

  // Debugging logs
  useEffect(() => {
    console.log("Selected program ID:", selectedProgramId);
  }, [selectedProgramId]);

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    await onConfirmAllocate(data.program_id, selectedStudent?.id!);
    setIsOpen(false);
  };

  //   if (!selectedStudent || !availablePrograms) {
  //     return null;
  //   }

  return (
    <ResponsiveDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Allocate Support"
      description="Select a program to allocate for this student."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} ref={formRef}>
          <div className="mt-6 space-y-4">
            <FormField
              control={form.control}
              name="program_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Available Programs</FormLabel>
                  <Select
                    value={String(field.value)}
                    onValueChange={(val) => field.onChange(Number(val))}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a program" />
                      </SelectTrigger>
                    </FormControl>
                    {availablePrograms && availablePrograms.length > 0 ? (
                      <SelectContent>
                        {availablePrograms.map((program) => (
                          <SelectItem
                            key={program.program_id!}
                            value={program.program_id!.toString()}
                          >
                            {program.program_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    ) : (
                      <p>No programs available.</p>
                    )}
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("program_id") > 0 && (
              <div className="text-sm text-muted-foreground space-y-1">
                {(() => {
                  const selected = availablePrograms?.find(
                    (p) => p.program_id === form.watch("program_id")
                  );
                  return selected ? (
                    <>
                      <p>
                        Total Donations: $
                        {(selected.allocated_amount ?? 0).toLocaleString()}
                      </p>
                      <p>
                        Remaining Amount: $
                        {(
                          selected.remaining_allocated_amount ?? 0
                        ).toLocaleString()}
                      </p>
                    </>
                  ) : null;
                })()}
              </div>
            )}

            <p>
              You are about to allocate support for{" "}
              <strong>{selectedStudent?.name}</strong>.
            </p>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <LoadingButton
                variant="default"
                type="submit"
                loading={isProcessing}
                disabled={isProcessing || !form.formState.isValid}
              >
                {isProcessing ? "Assigning..." : "Assign to program"}
              </LoadingButton>
            </div>
          </div>
        </form>
      </Form>
    </ResponsiveDialog>
  );
}
