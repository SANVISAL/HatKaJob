import React from "react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Icon } from "@/components";
import { Typography } from "../../../components/atoms/Typography";
import { Button } from "@/components/ui/button";
import { getProfileUser } from "@/lib/serverApi";
import { bufferToDataUrl } from "@/lib/utils";

const orDash = (value?: string) => value || "—";

const SeekerProfile = async () => {
  const profile = await getProfileUser();
  if (!profile) redirect("/login");

  const fields: [string, string | undefined][][] = [
    [
      ["Date of Birth", profile.DOB],
      ["Contact Number", profile.contactphone],
      ["Nationality", profile.nationality],
      ["Gender", profile.gender],
    ],
    [
      ["Location", profile.location],
      ["Address", profile.address],
      ["Education Background", profile.educationbackground],
    ],
  ];

  return (
    <>
      <div className="container xl:max-w-[1200px] bg-[#F8F9FA] rounded-xl mt-5 md:mt-10 p-5 md:px-24 md:py-10 mb-10">
        {/* top */}
        <div className="w-full flex md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Image
              src={bufferToDataUrl(profile.profile) || "/userProfile/seeker.svg"}
              alt="profile picture"
              width={120}
              height={120}
              unoptimized
              className="rounded-full object-cover w-[60px] h-[60px] md:w-[80px] md:h-[80px]"
            />
            <div className="ml-4 md:ml-6">
              <Typography className="mb-1 md:mb-2 text-[18px] md:text-[24px]">
                {orDash(profile.fullname)}
              </Typography>
              <Typography className="text-gray-400 text-[12px] md:text-[18px]">
                {orDash(profile.email)}
              </Typography>
            </div>
          </div>
          <div className="flex items-center">
            <Link href="/edit-profile">
              <Button className="bg-[#4B9960] rounded-full flex items-center justify-center gap-2 px-4 md:px-6 py-2">
                <Icon
                  label="Edit"
                  className="flex items-center justify-center"
                />
                <span className="hidden md:block">Edit profile</span>
              </Button>
            </Link>
          </div>
        </div>
        {/* bottom */}
        <div className="flex flex-col md:flex-row justify-between mt-5">
          {fields.map((column, i) => (
            <div key={i} className="w-full">
              {column.map(([label, value]) => (
                <div key={label} className="my-[25px]">
                  <Typography fontSize="lg">{label}</Typography>
                  <Typography>{orDash(value)}</Typography>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SeekerProfile;
