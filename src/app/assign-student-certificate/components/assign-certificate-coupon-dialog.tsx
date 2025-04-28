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
import { Coupons, Students, StudentCouponProgramInfo } from "@/types/types";

interface AllocateCouponDialogProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  selectedStudent: Students | null;
  onConfirmAssign: (studentId: string, couponId: string) => Promise<void>;
  isProcessing: boolean;
  availableCouponPrograms: StudentCouponProgramInfo[] | null; // Available coupon programs for this student
}

const AllocateCouponFormSchema = z.object({
  coupon_id: z.coerce.string().min(1, "Coupon is required"),
});

type FormFields = z.infer<typeof AllocateCouponFormSchema>;

export default function AllocateCouponDialog({
  isOpen,
  setIsOpen,
  selectedStudent,
  onConfirmAssign,
  isProcessing,
  availableCouponPrograms,
}: AllocateCouponDialogProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<FormFields>({
    resolver: zodResolver(AllocateCouponFormSchema),
    defaultValues: { coupon_id: "" }, // Initialize coupon_id
  });

  const { reset, watch, control } = form;

  useEffect(() => {
    if (isOpen) {
      reset({ coupon_id: "" }); // Reset form when dialog opens
    }
  }, [isOpen, reset]);

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    await onConfirmAssign(selectedStudent?.id!, data.coupon_id);
    // setIsOpen(false); // Close dialog after submission
  };

  const filteredCouponPrograms = availableCouponPrograms?.filter(
    (program) => program.student_id === selectedStudent?.id
  );

  return (
    <ResponsiveDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Choose a Coupon Program"
      description="Select a coupon program related to the selected student."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} ref={formRef}>
          <div className="mt-6 space-y-4">
            {/* Display the filtered list of coupon programs based on the selected student */}
            <FormField
              control={form.control}
              name="coupon_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Available Programs</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a coupon program" />
                      </SelectTrigger>
                    </FormControl>
                    {availableCouponPrograms &&
                    filteredCouponPrograms!.length > 0 ? (
                      <SelectContent>
                        {filteredCouponPrograms!.map((program) => (
                          <SelectItem
                            key={program.coupon_id}
                            value={program.coupon_id?.toString()!}
                          >
                            {program.program_name} {/* Display program name */}
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

            <div className="flex justify-end gap-3">
              <Button
                type="button"
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
                {isProcessing ? "Assigning..." : "Confirm Assign"}
              </LoadingButton>
            </div>
          </div>
        </form>
      </Form>
    </ResponsiveDialog>
  );
}
