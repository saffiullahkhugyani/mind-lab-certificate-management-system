"use client";
import { signOut } from "@/app/login/actions";
import React, { useTransition } from "react";
import { Button } from "./ui/button";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { cn } from "@/lib/utils/utils";

const SignOut = () => {
  const [isPending, startTransition] = useTransition();
  const onSubmit = async () => {
    startTransition(async () => {
      await signOut();
    });
  };
  return (
    <form action={onSubmit}>
      <Button
        className="w-full flex items-center gap-2"
        variant="outline"
        disabled={isPending}
      >
        {!isPending ? "Logout" : "Logging out..."}{" "}
        <AiOutlineLoading3Quarters
          className={cn("animate-spin", { hidden: !isPending })}
        />{" "}
      </Button>
    </form>
  );
};

export default SignOut;
