"use client";

import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { MyContext } from "@/contexts/CardInfoContext";
import { Card } from "./Card";
import { IUserProfile } from "@/Types/UserProfile";
import "../../../app/globals.css";

const CardList = ({ userProfile }: { userProfile: IUserProfile }) => {
  const { CardInfo, setCardInfo } = useContext(MyContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching data...");
        const response = await axios.get("http://localhost:4000/v1/jobs");
        console.log("Response data:", response.data);

        // Check if response.data.data is an array
        if (Array.isArray(response.data.data)) {
          const data = response.data.data.map((item: any) => ({
            id: item._id,
            companyId: item.companyId || "",
            companyLogo: item.companyLogo || "/default-logo.png",
            position: item.position || "Unknown position",
            location: item.location || "Unknown Location",
            time: item.time || "Unknown time",
            endDate: item.endDate || "No endDate",
            salary: item.salary || [],
            totalEmployees: item.totalEmployees || "number",
          }));
          console.log("Mapped data:", data);
          setCardInfo(data);
        } else {
          throw new Error("Expected an array but got something else");
        }
      } catch (error: any) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setCardInfo]);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   return <div>Error: {error}</div>;
  // }

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
        <div className="flex justify-center items-center">
          {loading ? <div className="spinner"></div> : null}
        </div>
      </main>
    </div>
  );
};

export default CardList;
