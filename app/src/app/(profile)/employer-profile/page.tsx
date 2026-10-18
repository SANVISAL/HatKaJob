import React from "react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Icon } from "@/components";
import { Typography } from "../../../components/atoms/Typography";
import { Button } from "@/components/ui/button";
import { getCompanyProfile } from "@/lib/getProfileUser";

const orDash = (value?: string) => value || "—";

const EmployerProfile = async () => {
  const company = await getCompanyProfile();
  if (!company) redirect("/login");

  const fields: [string, string | undefined][][] = [
    [
      ["Contact Email", company.contactemail],
      ["Contact Number", company.contactphone],
      ["Contact Person", company.contactPerson],
      ["Website", company.websitelink],
      ["Employees", company.numberOfemployees],
    ],
    [
      ["Location", company.location],
      ["Address", company.address],
      ["Company Description", company.companydescription],
    ],
  ];

  return (
    <>
      <div className="container xl:max-w-[1200px] bg-[#F8F9FA] rounded-xl mt-5 md:mt-10 p-5 md:px-24 md:py-10 ">
        {/* top */}
        <div className="w-full flex md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Image
              src={company.logo || "/company.svg"}
              alt="company logo"
              width={80}
              height={80}
              unoptimized
              className="rounded-full object-cover w-[60px] h-[60px] md:w-[80px] md:h-[80px]"
            />
            <div className="ml-4 md:ml-6">
              <Typography className="mb-1 md:mb-2 text-[18px] md:text-[20px]">
                {orDash(company.companyname)}
              </Typography>
              <Typography className="text-gray-400 text-[12px] md:text-[16px]">
                {orDash(company.contactemail)}
              </Typography>
            </div>
          </div>
          <div className="flex items-center">
            {/* Employers edit their company from the dashboard */}
            <Link href="/dashboard/profile">
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

export default EmployerProfile;
