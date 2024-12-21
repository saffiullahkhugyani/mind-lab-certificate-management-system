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
import { Clubs, Coupons, Programs } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useRef, useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { couponBatchProcess } from "../actions";
import { toast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  club_id: z.coerce.number().min(1, "Please select a club"),
  program_id: z.coerce.number().min(1, "Please select a program"),
});

// type form from schema
type FormFields = z.infer<typeof formSchema>;

interface CouponBatchProcessProps {
  clubs: Clubs[] | null;
  programs: Programs[] | null;
}

export default function CouponBatchProcess({
  clubs,
  programs,
}: CouponBatchProcessProps) {
  const [isPending, startTransition] = useTransition();
  const [filteredPrograms, setFilteredPrograms] = useState<Programs[]>([]);
  const [addedCoupons, setAddedCoupons] = useState<Coupons[]>([]);
  const [errors, setErrors] = useState<{ email: string; message: string }[]>(
    []
  );

  // initializing form reference from HTML FORM ELEMENT
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      club_id: 0,
      program_id: 0,
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
      console.log(data);

      const result = await couponBatchProcess(data.club_id, data.program_id);
      if (result?.success) {
        setAddedCoupons(result.addedCoupons!);
        toast({
          description: result?.message,
          variant: "success",
        });
      } else {
        setErrors(result.errors!);
        toast({
          description: result?.message,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] gap-4 mb-4">
      {/* Left: Form */}
      <Form {...form}>
        <form
          ref={formRef}
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="club_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Clubs</FormLabel>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a club"></SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {clubs?.map((club) => {
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
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="program_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Programs</FormLabel>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a program"></SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {filteredPrograms!.map((program) => {
                      if (
                        program.total_remaining_donation! >=
                        Number(program.subscription_value)
                      ) {
                        return (
                          <SelectItem
                            value={program.program_id!.toString()}
                            key={program.program_id!}
                          >
                            {program.program_english_name}
                          </SelectItem>
                        );
                      }
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <LoadingButton loading={isPending}>Submit</LoadingButton>
        </form>
      </Form>

      {/* Vertical Divider */}
      <div className="w-px bg-gray-300 h-auto"></div>

      {/* Right: Added Students Section */}
      <div className="space-y-2">
        <Label className="text-md font-bold">Number of added students</Label>
        <Input value={addedCoupons && addedCoupons.length.toString()}></Input>
      </div>
    </div>
  );
}
