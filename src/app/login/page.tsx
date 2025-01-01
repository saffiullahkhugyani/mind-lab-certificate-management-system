import React from "react";

import { readUserSession } from "@/lib/actions/action";
import LoginForm from "./components/LoginForm";
import { redirect } from "next/navigation";

export default async function Login() {
  const { data: userSession } = await readUserSession();

  if (userSession.session) {
    // return redirect("/create-certificate");
    return redirect("/dashboard");
  }

  return (
    <div>
      <LoginForm />
    </div>
  );
}
