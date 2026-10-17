"use client";
import Link from "next/link";
import NavLinks from "./nav-links";
import axios from "axios";
import { useEffect, useState } from "react";
import { ICompanyProfile } from "@/Types/CompanyProfile";

function SideNav({ companyProfile }: { companyProfile: ICompanyProfile }) {
  const [error, setError] = useState<string | null>(null);

  // Function to handle sign out
  const handleSignOut = async () => {
    try {
      setError(null);
      // await axios.post("/api/logout"); // Adjust the URL according to your backend endpoint
      await axios.get("http://localhost:4000/v1/auth/logout", {
        withCredentials: true,
      });
      window.location.href = "/login"; // Adjust the path according to your routing setup
    } catch (error: any) {
      console.log("error logout : ", error);

      // Use 'any' to catch any type of error
      if (error.response) {
        setError(`Sign out failed: ${error.response.data.message}`);
      } else if (error.request) {
        setError("Sign out failed: No response from server");
      } else {
        setError(`Sign out failed: ${error.message}`);
      }
      console.error("Error signing out:", error);
    }
  };

  // Function to get initials
  const getInitials = (name: string): string => {
    const initials = name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
    return initials.length > 2 ? initials.slice(0, 2) : initials;
  };

  // Ensure companyProfile.companyname is defined before using it
  const initials = companyProfile.companyname
    ? getInitials(companyProfile.companyname)
    : "";

  return (
    <div className="flex h-full flex-col bg-white px-5 border-r-1 border-gray-200">
      <Link
        className="mb-2 flex h-20 items-center justify-start rounded-md bg-white p-4 md:h-20"
        href="/"
      >
        <div className="w-32 text-white md:w-40 flex items-center">
          <div className="avatar rounded-full h-10 w-10 bg-emerald-500 font-[700] flex items-center justify-center">
            <p>{initials}</p>
          </div>
          <p className="ml-4 text-gray-900 capitalize">{companyProfile.companyname}</p>
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-white md:block"></div>
        <form>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex h-[48px] w-full grow items-center justify-center text-red-700 bg-red-100 p-3 text-sm font-medium md:flex-none md:justify-center md:p-2 md:px-3 rounded-lg"
          >
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
      {/* {error && <p className="text-red-500 mt-2">{error}</p>} */}
    </div>
  );
}

export { SideNav };
