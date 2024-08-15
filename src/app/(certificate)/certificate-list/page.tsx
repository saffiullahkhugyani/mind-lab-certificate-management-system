import { readUserSession } from "@/lib/actions/action";
import { redirect } from "next/navigation";
import React from "react";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { createClient } from "@/lib/supabase/server";

export default async function () {
  const supabase = createClient();
  const { data: userSession } = await readUserSession();

  if (!userSession.session) {
    return redirect("/login");
  }

  const { data: certificate } = await supabase
    .from("certificate_master")
    .select();

  console.log(certificate);

  return (
    <div className="container">
      <DataTable columns={columns} data={certificate!} />
    </div>
  );
}
