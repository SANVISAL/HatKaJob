"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Icon } from "@/components";
import { Typography } from "../../../components/atoms/Typography";
import { Button } from "@/components/ui/button";
import Modal from "@/components/molecules/Modal/Modal";
import EditEmployer from "@/app/dashboard/edit-employer/page";

const EmployerProfile: React.FC = () => {
  const [employerData, setEmployerData] = useState({
    id: "",
    logo: "",
    companyName: "",
    contactEmail: "",
    contactPhone: "",
    contactPerson: "",
    websiteLink: "",
    location: "",
    address: "",
    totalEmployees: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/v1/companies/profile",
          { withCredentials: true }
        );
        const company = response.data.data;
        if (!company) {
          setError("Company profile not found.");
          return;
        }
        setEmployerData({
          id: company._id,
          logo: company.logo || "",
          companyName: company.companyname || "",
          contactEmail: company.contactemail || "",
          contactPhone: company.contactphone || "",
          contactPerson: company.contactPerson || "",
          websiteLink: company.websitelink || "",
          location: company.location || "",
          address: company.address || "",
          totalEmployees: company.numberOfemployees || "",
          description: company.companydescription || "",
        });
      } catch (err) {
        console.error("Error fetching company profile:", err);
        setError("Unable to load company profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, []);

  const [isOpen, setIsOpen] = useState(false);

  const updateEmployerData = (updatedData: any) => {
    setEmployerData(updatedData);
    setIsOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-20">
        <Typography>{error}</Typography>
      </div>
    );
  }

  return (
    <>
      <div className="container xl:max-w-[1200px] bg-[#F8F9FA] rounded-xl mt-5 px-10 py-5">
        <div className="w-full flex md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Image
              src={employerData.logo || "/company.svg"}
              alt="company logo"
              width={80}
              height={80}
              unoptimized
              className="rounded-full object-cover w-[60px] h-[60px] md:w-[80px] md:h-[80px]"
            />
            <div className="ml-4 md:ml-6">
              <Typography className="mb-1 md:mb-2 text-[18px] md:text-[20px]">
                {employerData.companyName}
              </Typography>
              <Typography className="text-gray-400 text-[12px] md:text-[16px]">
                {employerData.contactEmail}
              </Typography>
            </div>
          </div>
          <div className="flex items-center">
            <Button
              onClick={() => setIsOpen(true)}
              className="bg-[#4B9960] rounded-full flex items-center justify-center gap-2 px-4 md:px-6 py-2"
            >
              <Icon label="Edit" className="flex items-center justify-center" />
              <span className="hidden md:block">Edit profile</span>
            </Button>
          </div>
        </div>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          size="xl"
          corner="3xl"
        >
          <div className="bg-white p-8">
            <h1 className="flex justify-center flex-col items-center">
              <EditEmployer />
            </h1>
          </div>
        </Modal>
        <div className="flex flex-col md:flex-row justify-between mt-5">
          <div className="w-full">
            <div className="my-[25px]">
              <Typography fontSize="lg">Contact Email</Typography>
              <Typography>{employerData.contactEmail}</Typography>
            </div>
            <div className="my-[25px]">
              <Typography fontSize="lg">Contact Number</Typography>
              <Typography>{employerData.contactPhone}</Typography>
            </div>
            <div className="my-[25px]">
              <Typography fontSize="lg">Contact Person</Typography>
              <Typography>{employerData.contactPerson}</Typography>
            </div>
            <div className="my-[25px]">
              <Typography fontSize="lg">Website</Typography>
              <Typography>{employerData.websiteLink}</Typography>
            </div>
            <div className="my-[25px]">
              <Typography fontSize="lg">Employees</Typography>
              <Typography>{employerData.totalEmployees}</Typography>
            </div>
          </div>
          <div className="w-full">
            <div className="my-[25px]">
              <Typography fontSize="lg">Location</Typography>
              <Typography>{employerData.location}</Typography>
            </div>
            <div className="my-[25px]">
              <Typography fontSize="lg">Address</Typography>
              <Typography>{employerData.address}</Typography>
            </div>
            <div className="my-[25px]">
              <Typography fontSize="lg">Company Description</Typography>
              <Typography>{employerData.description}</Typography>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployerProfile;
