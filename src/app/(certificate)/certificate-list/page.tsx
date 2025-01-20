import { readUserSession } from "@/lib/actions/action";
import { redirect } from "next/navigation";
import React from "react";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { createClient } from "@/lib/supabase/server";
import { getCertificateList } from "./actions";

export default async function page() {
  const supabase = createClient();
  const { data: userSession } = await readUserSession();

  if (!userSession.session) {
    return redirect("/login");
  }

  // const { data: certificate } = await supabase
  //   .from("certificate_master")
  //   .select();

  const response = await getCertificateList();

  return (
    <div className="container">
      <DataTable columns={columns} data={response.data!} />
    </div>
  );
}
