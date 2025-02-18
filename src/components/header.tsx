import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import React from "react";
import SignOut from "./SignOut";
import DateTimeDisplay from "./date-time";

const Header = async () => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="z-10 sticky top-0 w-full border-b border-border bg-primary text-white">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        {/* Home Link */}
        <nav className="flex items-center space-x-4 lg:space-x-6">
          <Link
            href="/"
            className="mr-6 flex items-center space-x-2 focus-visible:outline"
          >
            <span className="text-lg font-bold">Sponsor Portal</span>
          </Link>

          {/* Authenticated Navigation
          {user && (
            <div className="flex items-center gap-4">
              <Link href="/create-certificate" className="hover:text-gray-300 transition">
                Create Certificate
              </Link>
              <Link href="/certificate-list" className="hover:text-gray-300 transition">
                Certificate List
              </Link>
              <Link href="/donation-management" className="hover:text-gray-300 transition">
                Donation Management
              </Link>
              <Link href="/program-management" className="hover:text-gray-300 transition">
                Program Management
              </Link>
              <Link href="/coupon-management" className="hover:text-gray-300 transition">
                Coupon Management
              </Link>
            </div>
          )} */}
        </nav>

        {/* Right Section (DateTime + Logout) */}
        {user && (
          <div className="flex flex-1 items-center justify-end space-x-4">
            <DateTimeDisplay />
            <SignOut />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
