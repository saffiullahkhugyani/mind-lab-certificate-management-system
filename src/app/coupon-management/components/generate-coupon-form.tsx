"use client";

import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useRef, useState, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clubs, Profiles, Programs } from "@/types/types";
import { SearchableDropdown } from "./student-search";
import { LoadingButton } from "@/components/ui/loading-button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { addStudentCoupon } from "../actions";
import { toast } from "@/components/ui/use-toast";

const generateCouponFormSchema = z.object({
  student_id: z.string().min(1, "Student ID is required"),
  student_name: z.string().optional(),
  student_email: z.string().optional(),
  club_id: z.coerce.number().min(1, "Please select a club"),
  program_id: z.coerce.number().min(1, "Please select a program"),
  coupon_duration: z.string().min(1, "Please select a period"),
  start_period: z.string().min(1, "Start period is required"),
});

//  type from donation form schema
type FormFields = z.infer<typeof generateCouponFormSchema>;

interface GenerateCouponProps {
  clubs: Clubs[] | null;
  programs: Programs[] | null;
  studentProfiles: Profiles[] | null;
}

export default function GenerateCouponForm({
  clubs,
  programs,
  studentProfiles,
}: GenerateCouponProps) {
  const [filteredPrograms, setFilteredPrograms] = useState<Programs[]>([]);
  const [isPending, startTransition] = useTransition();

  const couponPeriod = [
    "1 month",
    "2 month",
    "3 month",
    "4 month",
    "5 month",
    "6 month",
    "7 month",
    "8 month",
    "9 month",
    "10 month",
    "11 month",
    "12 month",
  ];

  // initializing form reference from HTML FORM ELEMENT
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm({
    resolver: zodResolver(generateCouponFormSchema),
    defaultValues: {
      student_id: "",
      student_name: "",
      student_email: "",
      club_id: 0,
      program_id: 0,
      coupon_duration: "",
      start_period: "",
    },
  });

  const { reset, watch } = form;

  const selectedClubId = watch("club_id");

  useEffect(() => {
    const updatedPrograms = programs?.filter(
      (program) => program.club_id! === Number(selectedClubId)
    );

    setFilteredPrograms(updatedPrograms!);
  }, [selectedClubId, programs]);

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    startTransition(async () => {
      const couponData = {
        club_id: data.club_id,
        program_id: data.program_id,
        student_id: data.student_id,
        student_email: data.student_email,
        coupon_duration: data.coupon_duration,
        start_period: data.start_period,
      };

      const result = await addStudentCoupon(couponData, true);

      if (result.success) {
        toast({
          description:
            "Coupons successfully generated and assigned to the selected student",
          variant: "success",
        });
        reset();
      } else {
        toast({
          description: `Error generating coupons: ${result.error}`,
          variant: "destructive",
        });
      }
    });
  };

  const handleStudentSelect = (student: Profiles) => {
    form.setValue("student_id", student.id);
    form.setValue("student_name", student.name!);
    form.setValue("student_email", student.email!);
  };

  return (
    <>
      {/* Search */}
      <div className="gap-2 mb-4">
        <h3 className="font-bold text-lg">Search Student</h3>
        <SearchableDropdown<Profiles>
          items={studentProfiles!}
          placeholder="Search student..."
          onSelect={(student) => handleStudentSelect(student)}
          getLabel={(item) => item.name!}
          getValue={(item) => item.id!}
        />
      </div>
      <Form {...form}>
        <form
          ref={formRef}
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-4"
        >
          <div className="col-span-1 space-y-3">
            {/* Student ID */}

            {/* Club Interested In */}
            <FormField
              control={form.control}
              name="club_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Clubs</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value?.toString()}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a club">
                          {field.value
                            ? clubs?.find(
                                (club) => club.club_id === Number(field.value)
                              )?.club_name
                            : "Select a club"}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clubs!.map((club) => {
                        return (
                          club.club_id && (
                            <SelectItem
                              value={club.club_id.toString()}
                              key={club.club_id}
                            >
                              {club.club_name}
                            </SelectItem>
                          )
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Program Available */}
            <FormField
              control={form.control}
              name="program_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Programs</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value.toString()}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a program"></SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filteredPrograms!.map((program) => {
                        return (
                          <SelectItem
                            value={program.program_id!.toString()}
                            key={program.program_id!}
                          >
                            {program.program_english_name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Coupon Period */}
            <FormField
              control={form.control}
              name="coupon_duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="couponPeriod">Coupon period</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger>
                        {field.value || "Select period"}
                      </SelectTrigger>
                      <SelectContent>
                        {couponPeriod.map((period, index) => (
                          <SelectItem value={period} key={index}>
                            {period}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Period Options */}
            <FormField
              control={form.control}
              name="start_period"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Start period</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="current period" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Current period
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="future period" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Future period
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-1">
            {/* <h3 className="text-lg font-medium mb-2">Student Info</h3> */}
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="student_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student Id</FormLabel>
                    <FormControl>
                      <Input placeholder="Student Id" {...field} readOnly />
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
                      <Input placeholder="Student name" {...field} readOnly />
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
                      <Input placeholder="Student email" {...field} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* Buttons */}
          <div className="col-span-2 flex justify-end gap-4 mt-4 mr-4">
            <LoadingButton loading={isPending} className="">
              Generate
            </LoadingButton>
          </div>
        </form>
      </Form>
    </>
  );
}
