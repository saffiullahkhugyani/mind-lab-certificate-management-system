import { readUserSession } from "@/lib/actions/action";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { useUserStore } from "@/lib/store/user";
import Header from "@/components/header";

export default async function Layout({ children }: { children: ReactNode }) {
  const { data: userSession } = await readUserSession();

  if (!userSession.session) {
    return redirect("/login");
  }

  useUserStore.setState({ user: userSession.session.user });

  console.log(userSession.session.user.user_metadata);

  return <div className="w-full">{children}</div>;
}
