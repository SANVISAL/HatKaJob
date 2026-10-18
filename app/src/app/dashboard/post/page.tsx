"use client";
import React, { useEffect, useRef, useState } from "react";
import { Typography, Input, Button } from "@/components";
import { FaTrash } from "react-icons/fa";
import Modal from "@/components/molecules/Modal/Modal";
import { PostJobForm } from "@/components/organisms/dashboard/PostJobForm";
import axios from "axios";

const JOBS_URL = "http://localhost:4000/v1/jobs";

interface Company {
  id: string;
  position: string;
  salary: string;
  duration: string;
  dateLine: string;
}

const Dashboard: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Jobs posted by the logged-in employer's company
  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${JOBS_URL}/profile/jobs`, {
        withCredentials: true,
      });
      const jobs = Array.isArray(response.data.data) ? response.data.data : [];
      setCompanies(
        jobs.map((job: any) => ({
          id: job._id,
          position: job.position || "",
          salary: job.salary || "",
          duration: job.duration ? `${job.duration} months` : "",
          dateLine: job.endDate || "",
        }))
      );
      setError("");
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("Unable to load your jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);
  
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRow, setSelectRow] = useState <number | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const removeCandidate = async (index: number) => {
    try {
      await axios.delete(`${JOBS_URL}/${companies[index].id}`, {
        withCredentials: true,
      });
      const updatedCompanies = [...companies];
      updatedCompanies.splice(index, 1);
      setCompanies(updatedCompanies);
      setSelectRow(null);
    } catch (err) {
      console.error("Error deleting job:", err);
      setError("Unable to delete that job. Please try again.");
    }
  };

  const closeModal = () => {
    setIsOpen(false);
  };
  const handleClick= (index:number)=>{
    setSelectRow(index);
  }
  const handleRowDoubleClick =(id:string) =>{
  window.location.href= `/dashboard/post/detail/${id}`;
  }
  const handleClickOutside = (event: MouseEvent) => {
    if (tableRef.current && !tableRef.current.contains(event.target as Node)) {
      setSelectRow(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Typography fontSize="2xl">Total Post </Typography>
        <Button onClick={() => setIsOpen(true)} colorScheme="primary" textColor="white" size="sm" className="text-md px-4 py-2 rounded" >
        Create Post
        </Button>
      </div >
      <div ref={tableRef} className="overflow-x-auto shadow-md rounded-lg">
      <table className="min-w-full border-collapse">
        <thead >
          <tr className="bg-gray-200 text-sm rounded-lg">
          <th className="py-4 px-6 border-x text-left font-normal">Position</th>
            <th className="py-4 px-6 border-x text-left font-normal">Salary</th>
            <th className="py-4 px-6 border-x text-left font-normal">Duration</th>
            <th className="py-4 px-6 border-x text-left font-normal">Date Line</th>
            <th className="py-4 px-6 border-x font-normal">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-500">
        {(loading || error || companies.length === 0) && (
            <tr>
              <td colSpan={5} className="py-6 text-center text-sm">
                {loading
                  ? "Loading..."
                  : error || "No jobs posted yet. Click Create Post to add one."}
              </td>
            </tr>
          )}
        {companies.map((company, index) => (
            <tr
            key={index}
            className={`border-x ${index === selectedRow ? "bg-gray-300" : ""}`}
            onClick={() => handleClick(index)}
            onDoubleClick={() => handleRowDoubleClick(company.id)}
            >
              <td className="py-4 px-6  text-sm">{company.position}</td>
              <td className="py-4 px-6  text-sm">{company.salary}</td>
              <td className="py-4 px-6  text-sm">{company.duration}</td>
              <td className="py-4 px-6  text-sm">{company.dateLine}</td>
            
              <td className="py-4 px-6 flex justify-center items-center space-x-4">
              <div className="text-blue-500 cursor-pointer">
                    <Typography fontSize="sm">Edit</Typography>
                  </div>
                  <div
                    className="text-red-500 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeCandidate(index);
                    }}
                  >
                    <Typography fontSize="sm">Delete</Typography>
                  </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="xl" corner="3xl">
        <div className="bg-white p-8">
          <PostJobForm
            onSuccess={() => {
              setIsOpen(false);
              fetchJobs();
            }}
            onCancel={() => setIsOpen(false)}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;