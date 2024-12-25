"use client";

import React, { useRef, useTransition } from "react";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  Form,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sponsors } from "@/types/types";
import { addSponsorDonation } from "../actions";
import { LoadingButton } from "@/components/ui/loading-button";
import { toast } from "@/components/ui/use-toast";
import { SearchableDropdown } from "./sponsor-search";

export const donationReceiptFormSchema = z.object({
  sponsor_id: z.string().min(1, "Sponsor id is required"),
  sponsor_name: z.string().optional(),
  sponsor_number: z.string().optional(),
  company: z.string().optional(),
  address: z.string().optional(),
  source_of_amount: z.enum(["Card", "Cash", "Bank transfer"], {
    invalid_type_error: "Source of Amount must be selected",
  }),
  donation_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  donation_description: z
    .string()
    .min(10, "Description must be at least 10 characters long")
    .max(200, "Description cannot exceed 200 characters"),
  amount: z.number().positive("Amount must be positive"),
  bank_charges: z.number().positive("Amount must be positive"),
});

//  type from donation form schema
type FormFields = z.infer<typeof donationReceiptFormSchema>;

interface DonationReceiptFormProps {
  sponsors: Sponsors[] | null;
}

export default function DonationReceiptForm({
  sponsors,
}: DonationReceiptFormProps) {
  const sourceOfAmount = ["Card", "Cash", "Bank transfer"];
  const [isPending, startTransition] = useTransition();

  enum SourceOfAmount {
    Card = "Card",
    Cash = "Cash",
    BankTransfer = "Bank transfer",
  }

  // initializing form reference from HTML FORM ELEMENT
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<FormFields>({
    resolver: zodResolver(donationReceiptFormSchema),
    defaultValues: {
      // sponsor_id: sponsors?.at(0)?.sponsor_id.toString(),
      // sponsor_name: sponsors?.at(0)?.name!,
      // sponsor_number: sponsors?.at(0)?.phone_number!,
    },
  });

  const { reset } = form;

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    startTransition(async () => {
      const donationData = {
        sponsor_id: Number(data.sponsor_id),
        source_of_amount: data.source_of_amount,
        donation_description: data.donation_description,
        bank_charges: data.bank_charges,
        date: data.donation_date,
        amount: data.amount,
      };

      // inserting donation
      const result = await addSponsorDonation(donationData);

      if (result.success) {
        toast({
          description: "Donation has been added successfully",
          variant: "success",
        });

        reset({
          source_of_amount: "Bank transfer",
          donation_date: "",
          donation_description: "",
          amount: 0,
          bank_charges: 0,
          sponsor_id: "",
          sponsor_name: "",
          sponsor_number: "",
          company: "",
          address: "",
        });
      } else {
        toast({
          description: `Error adding donation: ${result.error}`,
          variant: "destructive",
        });
      }
    });
  };

  const handleSponsorSelect = (sponsor: Sponsors) => {
    form.setValue("sponsor_id", sponsor.sponsor_id.toString());
    form.setValue("sponsor_name", sponsor.name!);
    form.setValue("sponsor_number", sponsor.phone_number!);
    form.setValue("company", sponsor.company ? sponsor.company : "");
    form.setValue("address", sponsor.address ? sponsor.address : "");
  };

  return (
    <>
      {/* Search */}
      <div className="col-span-2 flex items-center gap-4 mb-4">
        <SearchableDropdown<Sponsors>
          items={sponsors!}
          placeholder="Search sponsors..."
          onSelect={(sponsor) => handleSponsorSelect(sponsor)}
          getLabel={(item) => item.name!.trim()}
          getValue={(item) => item.sponsor_id.toString().trim()}
        />
      </div>
      <Form {...form}>
        <form
          ref={formRef}
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-[1fr_auto_1fr] gap-4"
        >
          {/* Source of Amount */}
          <div className="col-span-1">
            <h3 className="text-lg font-medium mb-2">Source of Amount</h3>
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="source_of_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment type"></SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sourceOfAmount.map((source, index) => {
                          return (
                            <SelectItem value={source} key={index}>
                              {source}
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
                name="donation_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Donation date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        placeholder="Donation date"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="donation_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Donation description</FormLabel>
                    <FormControl>
                      <Input placeholder="Donation description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Donation amount</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="Donation amount"
                          onWheel={(e) => (e.target as HTMLElement).blur()}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bank_charges"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank charges</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="Bank charges"
                          onWheel={(e) => (e.target as HTMLElement).blur()}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="w-px bg-gray-300 h-auto"></div>

          {/* Receipt Info */}
          <div className="col-span-1">
            <h3 className="text-lg font-medium mb-2">Receipt Info</h3>
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="sponsor_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sponsor Id</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Sponsor Id"
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
                name="sponsor_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sponsor Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Sponsor name"
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
                name="sponsor_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sponsor Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Sponsor number"
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
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Company"
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
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Address"
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

          {/* Buttons */}
          <div>
            <LoadingButton loading={isPending} className="">
              Add Donation
            </LoadingButton>
          </div>
        </form>
      </Form>
    </>
  );
}
