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
import React, { useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { SearchableDropdown } from "./student-search";
import { assignStudentCertificate } from "../actions";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";

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
  coupon_id: z.string().min(1, "Please select a coupon"),
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
  const [selectedStudent, setSelectedStudent] = useState<Students | null>(null);
  const [selectedCertificate, setSelectedCertificate] =
    useState<ProgramCertificate | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [filteredCoupons, setFilteredCoupons] = useState<
    StudentCouponProgramInfo[]
  >([]);
  const [selectedCouponRecord, setSelectedCouponRecord] =
    useState<StudentCouponProgramInfo | null>(null);
  const [filteredProgramCertificates, setFilteredProgramCertificates] =
    useState<ProgramCertificate[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<FormField>({
    resolver: zodResolver(FormSchema),
  });

  // initializing form reference
  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit: SubmitHandler<FormField> = async (data) => {
    if (!data.coupon_id) {
      toast({
        description: "Please select a coupon",
        variant: "destructive",
      });
      return;
    }
    setIsProcessing(true);

    try {
      const addProgramCertificateData = {
        student_id: data.student_id,
        program_certificate_id: data.certificate_id,
        rating: data.rating ?? 0,
        completion_status: data.completion_status,
        coupon_id: Number(data.coupon_id), // Use from form data instead of state
      };

      const response = await assignStudentCertificate(
        addProgramCertificateData
      );

      if (response.success) {
        router.refresh(); // Refresh the page to see the changes
        // Reset form first
        form.reset();
        setSelectedStudent(null);
        setSelectedCouponRecord(null);
        setSelectedCertificate(null);
        setFilteredCoupons([]);
        setFilteredProgramCertificates([]);

        toast({
          description: "Certificate assigned successfully",
          variant: "success",
        });
      } else {
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
      setIsProcessing(false);
    }
  };

  // function for handling the student selection
  const handleStudentSelect = (student: Students) => {
    // Reset all dependent fields
    form.resetField("coupon_id");
    form.resetField("certificate_id");
    setSelectedCouponRecord(null);
    setSelectedCertificate(null);
    setFilteredProgramCertificates([]);

    // Set new student values
    setSelectedStudent(student);
    form.setValue("student_id", student.id ? student.id : "");
    form.setValue("student_name", student.name ? student.name : "");
    form.setValue("student_email", student.email ? student.email : "");

    // Filter coupons for the selected student
    if (student.id) {
      const studentCoupons = programCouponData.filter(
        (coupon) => coupon.student_id === student.id
      );
      setFilteredCoupons(studentCoupons);
    } else {
      setFilteredCoupons([]);
    }
  };

  // function for handling the coupon selection
  const handleCouponSelect = (couponId: string) => {
    // Reset dependent certificate field
    form.setValue("certificate_id", "");
    setSelectedCertificate(null);

    const fullRecord = filteredCoupons.find(
      (pc) => pc.coupon_id!.toString() === couponId
    );
    setSelectedCouponRecord(fullRecord || null);

    // Filter certificates by program_id
    if (fullRecord) {
      const matchingCertificates = programCertificates.filter(
        (cert) => cert.program_id === fullRecord.program_id
      );
      setFilteredProgramCertificates(matchingCertificates);
    } else {
      setFilteredProgramCertificates([]);
    }

    form.setValue("coupon_id", couponId);
  };

  const handleProgramCertificateTempleteSelect = (certificateId: string) => {
    const selectedCert = filteredProgramCertificates.find(
      (cert) => cert.id === certificateId
    );
    setSelectedCertificate(selectedCert || null);
    form.setValue("certificate_id", certificateId);
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
            {/*Section : selecting a coupon */}

            <FormField
              control={form.control}
              name="coupon_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coupon</FormLabel>
                  <Select
                    onValueChange={handleCouponSelect}
                    disabled={!selectedStudent}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            selectedStudent
                              ? "Select a coupon"
                              : "Please select student first"
                          }
                        >
                          {field.value && selectedCouponRecord ? (
                            <div className="flex items-center gap-2">
                              <span>{selectedCouponRecord.program_name}</span>
                              <span className="text-xs text-gray-500">
                                ({selectedCouponRecord.coupon_codes!.length}{" "}
                                codes)
                              </span>
                            </div>
                          ) : (
                            "Select a coupon"
                          )}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <ScrollArea className="h-60">
                        {filteredCoupons.map((pc) => (
                          <SelectItem
                            value={pc.coupon_id!.toString()}
                            key={pc.coupon_id}
                          >
                            <div className="flex flex-col">
                              <div className="flex justify-between">
                                <span>{pc.program_name}</span>
                              </div>
                              <div className="text-xs text-gray-400">
                                Valid:{" "}
                                {new Date(pc.start_date!).toLocaleDateString()}{" "}
                                - {new Date(pc.end_date!).toLocaleDateString()}
                              </div>
                              coupon codes
                              <span className="text-xs text-gray-500">
                                {pc.coupon_codes!.map((code, index) => (
                                  <span key={code} className="font-mono">
                                    {code}
                                    {index < pc.coupon_codes!.length - 1 &&
                                      ", "}
                                  </span>
                                ))}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </ScrollArea>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Section : selecting program certificate templete*/}
            <FormField
              control={form.control}
              name="certificate_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program Certificate</FormLabel>
                  <Select
                    onValueChange={handleProgramCertificateTempleteSelect}
                    disabled={!selectedCouponRecord}
                    value={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          selectedStudent
                            ? "Select a program certificate"
                            : "Please select a coupon first"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredProgramCertificates.length > 0 ? (
                        filteredProgramCertificates.map((cert) => (
                          <SelectItem value={cert.id!} key={cert.id}>
                            {cert.certificate_name_english}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-2 text-sm text-gray-500">
                          {selectedCouponRecord
                            ? "No certificates available for this program"
                            : "Please select a coupon first"}
                        </div>
                      )}
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
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;

                        if (value === "") {
                          field.onChange(undefined);
                          return;
                        }

                        let parsedValue = parseFloat(value);

                        if (!isNaN(parsedValue)) {
                          // Clamp to 1-5 range
                          parsedValue = Math.min(Math.max(parsedValue, 1), 5);

                          // Round to 1 decimal place
                          const rounded = Math.round(parsedValue * 10) / 10;

                          field.onChange(rounded);
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
            <LoadingButton loading={isProcessing}>
              Issue Certificate
            </LoadingButton>
          </div>
          {/* </div> */}
        </form>
      </Form>
    </div>
  );
}
