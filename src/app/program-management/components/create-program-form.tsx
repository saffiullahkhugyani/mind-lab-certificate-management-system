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
import { LoadingButton } from "@/components/ui/loading-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { addProgram } from "../actions";
import { toast } from "@/components/ui/use-toast";
import { Clubs } from "@/types/types";

export const CreateProgramFormSchema = z.object({
  club_id: z.coerce.number().min(1, { message: "Club is required" }),
  program_english_name: z
    .string()
    .min(2, { message: "Program english name is required" }),
  program_arabic_name: z
    .string()
    .min(2, { message: "Program arabic name is required" }),
  period: z.string().min(1, { message: "Program period is required" }),
  subscription_value: z
    .string()
    .min(2, { message: "Subscription value is required" }),
  description: z.string().min(10, { message: "Description is required" }),
});

//  type from schema
type FormFields = z.infer<typeof CreateProgramFormSchema>;

interface CreateProgramProps {
  clubsList: Clubs[] | null;
}

export default function CreateProgramForm({ clubsList }: CreateProgramProps) {
  const [isPending, startTransition] = useTransition();

  // initializing form reference from HTML FORM ELEMENT
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<FormFields>({
    resolver: zodResolver(CreateProgramFormSchema),
    defaultValues: {},
  });

  const { reset, watch } = form;

  // onsubmit function
  const onSubmit: SubmitHandler<FormFields> = (data) => {
    console.log(data);
    startTransition(async () => {
      const response = await addProgram(data);

      if (response?.success) {
        toast({
          description: "Program has been added successfully",
          variant: "success",
        });

        reset({
          club_id: 0,
          program_english_name: "",
          program_arabic_name: "",
          period: "",
          subscription_value: "",
          description: "",
        });
      }

      if (response?.error) {
        toast({
          description: response.error,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-3 w-full"
      >
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
                        ? clubsList?.find(
                            (club) => club.club_id === Number(field.value)
                          )?.club_name
                        : "Select a club"}
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {clubsList!.map((club) => {
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
        <FormField
          control={form.control}
          name="program_english_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Program english name</FormLabel>
              <FormControl>
                <Input placeholder="Program english name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="program_arabic_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Program arabic name</FormLabel>
              <FormControl>
                <Input placeholder="Program arabic name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="period"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Program period</FormLabel>
              <FormControl>
                <Input placeholder="In days" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subscription_value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subscription value</FormLabel>
              <FormControl>
                <Input placeholder="Subscription value" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex  justify-center m-2 ">
          <LoadingButton loading={isPending} className="w-auto gap-4 m-2">
            Add Program
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
}
