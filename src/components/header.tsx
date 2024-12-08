import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import React from "react";
import SignOut from "./SignOut";

const Header = async () => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="z-10z-10 sticky top-0 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <nav className="flex items-center space-x-4 lg:space-x-6">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <span className="font-bold">CMS</span>
          </a>{" "}
          {user != null && (
            <div className="flex items-center gap-4">
              <Link href={"/create-certificate"}>Create Certificate</Link>
              <Link href={"/certificate-list"}>Certificate List</Link>
              <Link href={"/donation-management"}>Donation Management</Link>
              <Link href={"/program-management"}>Program Management</Link>
              <Link href={"/coupon-management"}>Coupon Management</Link>
            </div>
          )}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {user != null && (
            <div className="flex items-center gap-4">
              <p>{user.email}</p>
              <SignOut />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
