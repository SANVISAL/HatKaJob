import React from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";

const UserNav = () => {

  const handleLogout = async () => {
    try {
      const response = await axios.get("http://localhost:4000/v1/auth/logout", {
        withCredentials: true,
      });
      console.log("response:", response.data);
      // router.replace("/"); // Use replace to avoid adding to history
      // router.push("/");
      window.location.href = "/";
    } catch (error) {
      console.log("error:", error);
      if (axios.isAxiosError(error)) {
        // Handle axios errors (e.g., network errors or backend errors)
        if (error.response) {
          // Server responded with a status other than 200 range
          console.error("Backend returned an error:", error.response.data);
        } else if (error.request) {
          // Request was made but no response received
          console.error("No response received:", error.request);
        } else {
          // Something happened in setting up the request that triggered an error
          console.error("Error in setup:", error.message);
        }
      } else {
        // Handle other potential errors
        console.error("Error:", error);
      }
    }
  };

  return (
    <div className="flex justify-center items-center py-20">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mr-20">
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Favorite</DropdownMenuItem>
          <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export { UserNav };
