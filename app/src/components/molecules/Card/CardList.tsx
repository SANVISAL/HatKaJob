"use client";

import React, { useContext, useEffect } from "react";
import { MyContext } from "@/contexts/CardInfoContext";
import { Card } from "./Card";
import { IUserProfile } from "@/Types/UserProfile";
import "../../../app/globals.css";

const toCard = (item: any): any => ({
  id: item._id,
  companyId: item.companyId || "",
  companyLogo: item.companyLogo || "/default-logo.png",
  position: item.position || "Unknown position",
  location: item.location || "Unknown Location",
  time: item.time || "Unknown time",
  endDate: item.endDate || "No endDate",
  salary: item.salary || [],
  totalEmployees: item.totalEmployees || "number",
});

const CardList = ({
  userProfile,
  initialJobs,
}: {
  userProfile: IUserProfile;
  initialJobs: any[];
}) => {
  const { CardInfo, setCardInfo } = useContext(MyContext);

  // Jobs are fetched on the server (see app/page.tsx), so there is no
  // client-side request waterfall after hydration
  useEffect(() => {
    setCardInfo(initialJobs.map(toCard));
  }, [initialJobs, setCardInfo]);

  return (
    <div>
      <main className="max-w-[1200px] mx-auto my-10">
        <h1 className="ml-8 text-xl my-12">
          Latest <span className="text-green-500">Intern</span>
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px] container">
          {CardInfo.map((job) => (
            <div key={job.id} className="card-container">
              <Card
                className="w-full h-auto"
                data={job}
                userProfile={userProfile}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CardList;
