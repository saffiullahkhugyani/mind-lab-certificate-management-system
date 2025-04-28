"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ProgramCertificate,
  StudentCouponProgramInfo,
  Students,
} from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useRef, useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { SearchableDropdown } from "./student-search";
import { assignStudentCertificate } from "../actions";
import { useToast } from "@/components/ui/use-toast";
import AllocateCouponDialog from "./assign-certificate-coupon-dialog";

interface AssignStudentCertificateFormProps {
  students: Students[];
  programCertificates: ProgramCertificate[];
  programCouponData: StudentCouponProgramInfo[];
}

// schema for the form validation
const FormSchema = z.object({
  student_name: z.string().optional(),
  student_email: z.string().optional(),
  student_age_group: z.string().optional(),
  student_id: z.string().min(1, { message: "Please select a student" }),
  certificate_id: z.string().min(1, { message: "Please select a certificate" }),
  rating: z
    .number()
    .max(5, { message: "Rating cannot be more than 5" })
    .optional(),
  completion_status: z.boolean({
    required_error: "Please select completion status",
  }),
});

type FormField = z.infer<typeof FormSchema>;

export default function AssignStudentCertificateForm({
  students,
  programCertificates,
  programCouponData,
}: AssignStudentCertificateFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State for dialog visibility
  const [selectedStudent, setSelectedStudent] = useState<Students | null>(null);
  const [submittedData, setSubmittedData] = useState<FormField | null>(null);
  const [selectedCertificate, setSelectedCertificate] =
    useState<ProgramCertificate | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormField>({
    resolver: zodResolver(FormSchema),
  });

  // initializing form reference
  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit: SubmitHandler<FormField> = async (data) => {
    setSubmittedData(data); // Store the form data
    handleAssignClick(); // Open the dialog when "Assign" button is clicked
    // startTransition(async () => {
    //   const addProgramCertificateData = {
    //     student_id: data.student_id,
    //     program_certificate_id: data.certificate_id,
    //     rating: data.rating ?? 0,
    //     completion_status: data.completion_status,
    //   };
    //   const response = await assignStudentCertificate(
    //     addProgramCertificateData!
    //   );
    //   console.log("response: ", response);
    //   if (response.success) {
    //     toast({
    //       description: "Certificate assigned successfully",
    //       variant: "success",
    //     });
    //   }
    //   if (response.error) {
    //     toast({
    //       description: response.error,
    //       variant: "destructive",
    //     });
    //   }
    // });
  };

  const handleStudentSelect = (student: Students) => {
    setSelectedStudent(student);
    form.setValue("student_id", student.id ? student.id : "");
    form.setValue("student_name", student.name ? student.name : "");
    form.setValue("student_email", student.email ? student.email : "");
  };

  const onConfirmAssign = async (studentId: string, couponId: string) => {
    if (!submittedData) return; // Safety check

    setIsProcessing(true); // Start processing
    try {
      const addProgramCertificateData = {
        student_id: submittedData.student_id,
        program_certificate_id: submittedData.certificate_id,
        rating: submittedData.rating ?? 0,
        completion_status: submittedData.completion_status,
        coupon_id: Number(couponId),
      };

      const response = await assignStudentCertificate(
        addProgramCertificateData
      );

      console.log("response:", response);

      if (response.success) {
        toast({
          description: "Certificate assigned successfully",
          variant: "success",
        });
      } else if (response.error) {
        toast({
          description: response.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error assigning certificate:", error);
      toast({
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false); // Always reset, even if error happens
      setIsDialogOpen(false); // Close the dialog
    }
  };

  const handleAssignClick = () => {
    // Open the dialog when "Assign" button is clicked
    setIsDialogOpen(true);
  };

  return (
    <div className="mx-auto bg-white shadow-md p-4 rounded-md m-2">
      {/* Search */}
      <div className="gap-2 mb-4">
        <h3 className="font-bold text-lg">Search Student</h3>
      </div>
      <Form {...form}>
        <form
          ref={formRef}
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-[1fr_auto_1fr] gap-4"
        >
          <div className="col-span-1 space-y-3">
            <SearchableDropdown<Students>
              items={students!}
              onSelect={(student) => handleStudentSelect(student)}
              getLabel={(item) => item.name!}
              getValue={(item) => item.id!}
            />
            {/* Section : selecting program certificate*/}
            <FormField
              control={form.control}
              name="certificate_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program Certificate</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a program certificate">
                          {field.value
                            ? programCertificates!.find(
                                (pc) => pc.id === field.value
                              )?.certificate_name_english
                            : "Select a program"}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {programCertificates.map((pc) => {
                        return (
                          <SelectItem value={pc.id!} key={pc.id}>
                            {pc.certificate_name_english}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      placeholder="Enter rating (1-5)"
                      value={field.value || ""}
                      onChange={(e) => {
                        const value = e.target.value;

                        // If input is empty, set rating as undefined (optional)
                        if (value === "") {
                          field.onChange(undefined);
                          return;
                        }

                        // Parse the number and ensure it's valid
                        const parsedValue = parseFloat(value);
                        if (!isNaN(parsedValue)) {
                          field.onChange(parsedValue);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="completion_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Completion Status</FormLabel>
                  <Select
                    onValueChange={(value) =>
                      field.onChange(value === "completed")
                    }
                    value={
                      field.value === true
                        ? "completed"
                        : field.value === false
                        ? "not_completed"
                        : ""
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="not_completed">
                        Not Completed
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Vertical Divider */}
          <div className="w-px bg-gray-300 h-auto"></div>

          <div className="col-span-1 space-y-3">
            <Label className="text-lg font-bold">Student Info</Label>
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="student_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student Id</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Student Id"
                        {...field}
                        value={field.value ?? ""}
                        readOnly
                        disabled={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="student_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Student name"
                        {...field}
                        value={field.value ?? ""}
                        readOnly
                        disabled={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="student_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Student email"
                        {...field}
                        value={field.value ?? ""}
                        readOnly
                        disabled={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div>
            <LoadingButton loading={isPending}>Issue Certificate</LoadingButton>
          </div>
          {/* </div> */}
        </form>
      </Form>
      <AllocateCouponDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        selectedStudent={selectedStudent}
        onConfirmAssign={onConfirmAssign}
        isProcessing={isProcessing}
        availableCouponPrograms={programCouponData}
      />
    </div>
  );
}
