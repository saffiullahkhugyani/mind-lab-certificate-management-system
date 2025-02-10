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
import { Profiles } from "@/types/customs";
import { ProgramCertificate } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useRef, useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { SearchableDropdown } from "./student-search";
import { assignStudentCertificate } from "../actions";
import { toast } from "@/components/ui/use-toast";

interface AssignStudentCertificateFormProps {
  students: Profiles[];
  programCertificates: ProgramCertificate[];
}

// schema for the form validation
const FormSchema = z.object({
  student_name: z.string().optional(),
  student_email: z.string().optional(),
  student_age_group: z.string().optional(),
  student_id: z.string().min(1, { message: "Please select a student" }),
  certificate_id: z.string().min(1, { message: "Please select a certificate" }),
  rating: z.string().optional(),
});

type FormField = z.infer<typeof FormSchema>;

export default function AssignStudentCertificateForm({
  students,
  programCertificates,
}: AssignStudentCertificateFormProps) {
  const [selectedStudent, setSelectedStudent] = useState<Profiles | null>(null);
  const [selectedCertificate, setSelectedCertificate] =
    useState<ProgramCertificate | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormField>({
    resolver: zodResolver(FormSchema),
  });

  // initializing form reference
  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit: SubmitHandler<FormField> = async (data) => {
    startTransition(async () => {
      const addProgramCertificateData = {
        student_id: data.student_id,
        program_certificate_id: data.certificate_id,
        rating: data.rating ?? "",
      };

      const response = await assignStudentCertificate(
        addProgramCertificateData
      );

      console.log("response: ", response);

      if (response.success) {
        toast({
          description: "Certificate assigned successfully",
          variant: "success",
        });
      }

      if (response.error) {
        toast({
          description: response.error,
          variant: "destructive",
        });
      }
    });
  };

  const handleStudentSelect = (student: Profiles) => {
    form.setValue("student_id", student.id ? student.id : "");
    form.setValue("student_name", student.name ? student.name : "");
    form.setValue("student_email", student.email ? student.email : "");
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
            <SearchableDropdown<Profiles>
              items={students!}
              placeholder="Search student..."
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
                    <Input placeholder="rating" {...field} />
                  </FormControl>
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
            <LoadingButton loading={isPending}>
              Assign Certificate
            </LoadingButton>
          </div>
          {/* </div> */}
        </form>
      </Form>
    </div>
  );
}
