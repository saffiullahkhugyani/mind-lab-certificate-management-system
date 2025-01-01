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
import React, { useEffect, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AuthTokenResponse } from "@supabase/supabase-js";
import { Form } from "@/components/ui/form";
import { log } from "console";
import { AiOutlineAlert, AiOutlineLoading3Quarters } from "react-icons/ai";
import { cn } from "@/lib/utils/utils";
import { readUserSession } from "@/lib/actions/action";
import { emailLogin } from "../actions";
import { useSearchParams } from "next/navigation";

const FormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, { message: "Password can not be empty" }),
});

type FormFields = z.infer<typeof FormSchema>;

export default function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const [urlMessage, setUrlMessage] = useState<string>("");
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const searchParam = useSearchParams();
  const message = searchParam.get("message");

  useEffect(() => {
    setUrlMessage(message!);
  }, []);

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    startTransition(async () => {
      await emailLogin(data);
    });
  };

  return (
    <section className="h-[calc(100vh-57px)] flex justify-center items-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
          <CardContent className="flex flex-col gap-4">
            <Form {...form}>
              <form
                className="grid gap-4"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <div className="grid gap-2">
                  <Label>Email</Label>
                  <Input
                    {...form.register("email")}
                    id="email"
                    name="email"
                    type="email"
                    placeholder="dev@email.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    {...form.register("password")}
                    minLength={6}
                    name="password"
                    id="password"
                    type="password"
                    required
                  />
                </div>
                {urlMessage && (
                  <div className="text-sm font-medium text-destructive">
                    {urlMessage}
                  </div>
                )}
                <Button className="w-full gap-2" disabled={isPending}>
                  {"Login"}
                  {""}
                  <AiOutlineLoading3Quarters
                    className={cn("animate-spin", { hidden: !isPending })}
                  />{" "}
                </Button>
              </form>
            </Form>
          </CardContent>
        </CardHeader>
      </Card>
    </section>
  );
}
