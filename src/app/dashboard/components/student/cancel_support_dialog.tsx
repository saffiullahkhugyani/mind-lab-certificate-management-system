import React, { Dispatch, SetStateAction, useRef, useEffect } from "react";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { Profiles } from "@/types/customs";
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
import { Programs } from "@/types/types";
import { LoadingButton } from "@/components/ui/loading-button";

interface CancelSupportDialogProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  selectedStudent: Profiles | null;
  onConfirmCancel: (programId: number) => Promise<void>;
  isProcessing: boolean;
  selectedStudentPrograms: Programs[] | null;
}

const CancelSupportFormSchema = z.object({
  program_id: z.coerce.number().min(1, { message: "Please select a program." }),
});

type FormFields = z.infer<typeof CancelSupportFormSchema>;

export default function CancelSupportDialog({
  isOpen,
  setIsOpen,
  selectedStudent,
  onConfirmCancel,
  isProcessing,
  selectedStudentPrograms,
}: CancelSupportDialogProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<FormFields>({
    resolver: zodResolver(CancelSupportFormSchema),
    defaultValues: { program_id: 0 },
  });

  const { reset } = form;

  useEffect(() => {
    if (isOpen) {
      reset({ program_id: 0 });
    }
  }, [isOpen, reset]);

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    await onConfirmCancel(data.program_id);
    setIsOpen(false);
  };

  if (!selectedStudent || !selectedStudentPrograms) {
    return null;
  }

  return (
    <ResponsiveDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Cancel Support"
      description="Are you sure you want to cancel support for this student?"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mt-6 space-y-4">
            <FormField
              control={form.control}
              name="program_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Programs</FormLabel>
                  <Select
                    {...field}
                    onValueChange={field.onChange}
                    value={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a program" />
                      </SelectTrigger>
                    </FormControl>
                    {selectedStudentPrograms.length > 0 ? (
                      <SelectContent>
                        {selectedStudentPrograms.map((program) => (
                          <SelectItem
                            value={program.program_id!.toString()}
                            key={program.program_id!}
                          >
                            {program.program_english_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    ) : (
                      <p>No programs available for this student.</p>
                    )}
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p>
              This action will remove {selectedStudent?.name} from your
              supported students list.
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
                variant="destructive"
                type="submit"
                disabled={isProcessing || !form.formState.isValid}
              >
                {isProcessing ? "Processing..." : "Confirm Cancel Support"}
              </LoadingButton>
            </div>
          </div>
        </form>
      </Form>
    </ResponsiveDialog>
  );
}
