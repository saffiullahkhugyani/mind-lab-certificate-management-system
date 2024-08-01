import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

const Header = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="z-10z-10 sticky top-0 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <nav className="flex items-center space-x-4 lg:space-x-6">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <span className="font-bold">CMS</span>
          </a>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <Link href={"/create-certificate"}>Create Certificate</Link>
          <Link href={"/certificate-list"}>Certificate List</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
