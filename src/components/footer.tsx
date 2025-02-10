import { createClient } from "@/lib/supabase/server";
import Image from "next/image";

const Footer = async () => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <footer className="z-10 w-full bg-gray-200">
      <div className="container mx-auto flex h-14 max-w-screen-2xl items-center justify-between px-4">
        {/* Left-aligned Company Logo */}
        <div>
          <Image
            src="/company-logo.png"
            alt="Company Logo"
            width={100}
            height={100}
            className="object-contain"
          />
        </div>

        {/* Show Developer Logo only if user is logged in */}
        {user != null && (
          <div className="flex items-center gap-4">
            <p className="font-medium">Developed by</p>
            <Image
              src="/developer-logo.png"
              alt="Developer Logo"
              width={120}
              height={120}
              className="object-contain"
            />
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;
