"use client";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const SearchFormSchema = z.object({
  instituteName: z
    .string()
    .min(1, { message: "Please enter institute name to search" }),
});

type SearchFormField = z.infer<typeof SearchFormSchema>;

const SearchCertificate = ({
  searchString,

  openSearch,
}: {
  openSearch: React.Dispatch<React.SetStateAction<boolean>>;
  searchString: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const form = useForm<SearchFormField>({
    resolver: zodResolver(SearchFormSchema),
    defaultValues: {
      instituteName: "",
    },
  });

  const { reset } = form;

  const onSubmit: SubmitHandler<SearchFormField> = async (data) => {
    // console.log(data);
    searchString(data.instituteName);
    openSearch(true);
    reset();
  };
  return (
    <>
      <Form {...form}>
        <form
          className="bg-white shadow-md p-4 rounded-md m-2 space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="instituteName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-2xl font-bold">Search</FormLabel>
                <FormControl>
                  <Input placeholder="Search by institute name" {...field} />
                </FormControl>
                <FormDescription>
                  Enter institute name to seach for certificates
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            <Button>Search</Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default SearchCertificate;
