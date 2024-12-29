"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitHandler, useForm } from "react-hook-form";
import React, { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AuthTokenResponse } from "@supabase/supabase-js";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { log } from "console";
import { AiOutlineAlert, AiOutlineLoading3Quarters } from "react-icons/ai";
import { cn } from "@/lib/utils/utils";
import { LoadingButton } from "@/components/ui/loading-button";
import { updatePassword } from "./actions";
import { toast } from "@/components/ui/use-toast";

const FormSchema = z
  .object({
    password: z
      .string()
      .min(8)
      .regex(new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$"), {
        message:
          "Password must be at least 8 characters and contain an uppercase letter, lowercase letter, and number",
      }),
    confirmPassword: z.string().min(8, {
      message: "Password can not be empty",
    }),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"],
      });
    }
  });

type FormFields = z.infer<typeof FormSchema>;

export default function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [resetPasswordSuccess, setResetPasswordSuccess] =
    useState<boolean>(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Function to extract query parameters from URL
  function getQueryParams() {
    const url = window.location.href;
    const params = new URLSearchParams(url.split("#")[1]); // Split at # and use the second part
    return {
      accessToken: params.get("access_token"),
      refreshToken: params.get("refresh_token"),
    };
  }

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    const { accessToken, refreshToken } = getQueryParams();

    console.log(accessToken);

    if (!accessToken || !refreshToken) {
      toast({
        description: "Missing access token or refresh token in URL.",
        variant: "destructive",
      });
      return;
    }

    startTransition(async () => {
      const res = await updatePassword({ ...data, accessToken, refreshToken });

      if (res?.success) {
        setResetPasswordSuccess(res.success);
        toast({
          description: "Your password has been updated",
          variant: "success",
        });
      } else {
        toast({
          description: res?.error || "An error occurred",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <section className="h-[calc(100vh-57px)] flex justify-center items-center">
      {!resetPasswordSuccess ? (
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Reset Password</CardTitle>
            <CardDescription>Enter your new password</CardDescription>
            <CardContent className="flex flex-col gap-4">
              <Form {...form}>
                <form
                  className="grid gap-4"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type={showPassword ? "text" : "password"}
                            {...field}
                            className="w-full border p-2"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type={showPassword ? "text" : "password"}
                            {...field}
                            className="w-full border p-2"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div
                    className="cursor-pointer hover:underline"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <p className="text-sm">show password</p>
                  </div>

                  <LoadingButton
                    className="w-full gap-2"
                    disabled={isPending}
                    loading={isPending}
                  >
                    {"Reset"}
                  </LoadingButton>
                </form>
              </Form>
            </CardContent>
          </CardHeader>
        </Card>
      ) : (
        <div className="bg-green-100 text-green-600 text-xl px-2 py-4 rounded-md border-gray-300 border-2">
          Your password has been updated successfully, please use your new
          password to login.
        </div>
      )}
    </section>
  );
}
