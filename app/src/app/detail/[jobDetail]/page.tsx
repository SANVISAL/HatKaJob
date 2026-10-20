"use client";
import React from "react";
import { useEffect } from "react";
import axios from "axios";
import { Icon, Typography } from "@/components";
import { Button } from "@nextui-org/react";
import Image from "next/legacy/image";
import "../../globals.css";
import { useParams } from "next/navigation";
import Modal from "@/components/molecules/Modal/Modal";
import { useState } from "react";
import { API_URL } from "@/lib/config";

interface JobDetail {
  position?: string;
  salary?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  duration?: string;
  time?: string;
  availablePositions?: string;
  jobDescription?: string[] | string;
  jobResponsibilities?: string[] | string;
  logo?: string;
  companyName?: string;
  workplace?: string;
  totalEmployees?: string;
}

// Description fields hold HTML from the Quill editor. Extract the text of
// each paragraph / list item instead of rendering the HTML, so an employer
// can't inject markup or scripts into this page.
const toLines = (value?: string[] | string): string[] => {
  const html = Array.isArray(value) ? value.join("") : value || "";
  const doc = new DOMParser().parseFromString(html, "text/html");
  const blocks = Array.from(doc.body.querySelectorAll("p, li"));
  const lines = blocks.length
    ? blocks.map((el) => el.textContent || "")
    : [doc.body.textContent || ""];
  return lines.map((line) => line.trim()).filter(Boolean);
};

const orDash = (value?: string) => value || "—";

const Detail = () => {
  const route = useParams();
  const card = route.jobDetail;
  // Load the job by id so the page works on refresh and direct links,
  // not only when navigated to from the home page
  const [CardDetail, setCardDetail] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/v1/jobs/${card}`
        );
        if (response.data.data) {
          setCardDetail(response.data.data);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error("Error fetching job:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [card]);

  const [isOpen, setIsOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const toggleFavorite = () => {
    setIsFavorited((prevState) => !prevState);
  };
  const [starred, setStarred] = useState(false);
  const handleStarClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault(); // To prevent default behavior of link
    e.stopPropagation(); // To prevent redirect when star icon is clicked
    setStarred((prev) => !prev);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="spinner"></div>
      </div>
    );
  }

  if (notFound || !CardDetail) {
    return (
      <div className="flex justify-center items-center py-20">
        <Typography>Job not found</Typography>
      </div>
    );
  }

  const descriptionLines = toLines(CardDetail.jobDescription);
  const responsibilityLines = toLines(CardDetail.jobResponsibilities);

  return (
    <>
      <div className="w-full md:container mx-auto p-2 lg:p-0">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-5">
          <div className="col-span-7 p-2 lg:py-8 lg:px-14 border rounded-lg">
            <div className="flex justify-between mt-5">
              <div>
                {/* intern title */}
                <Typography className="text-[#4B9960] text-[18px] md:text-[24px]">
                  {`${CardDetail?.position}`}
                </Typography>
                {/* salary */}
                <Typography>{`${CardDetail?.salary}`}</Typography>
              </div>
              <div
                className="flex justify-center items-center"
                onClick={handleStarClick}
              >
                <button onClick={toggleFavorite}>
                  <Icon
                    className="mr-5"
                    size="md"
                    label={isFavorited ? "StarFill" : "Star"}
                  />
                </button>
                <Button
                  onClick={() => setIsOpen(true)}
                  className="bg-[#4B9960] outline-none text-white text-[14px] md:text-[16px]"
                >
                  Apply now
                </Button>
                <Modal
                  isOpen={isOpen}
                  onClose={() => setIsOpen(false)}
                  size="lg"
                  corner="2xl"
                >
                  <div className="bg-white p-8">
                    <h1 className="flex justify-center flex-col items-center">
                      <label
                        htmlFor="uploadFile1"
                        className="bg-white text-black text-base rounded w-full py-20 flex flex-col items-center justify-center gap-2 cursor-pointer border-2 border-gray-300 border-dashed mx-auto"
                      >
                        <Icon label="FileUpload" />
                        <input
                          type="file"
                          id="uploadFile1"
                          className="hidden"
                        />
                        <p className="text-base text-gray-900 mt-2">
                          Drag and drop file here
                        </p>
                        <p>or</p>
                        <p className="text-blue-600">Brow your file here</p>
                      </label>
                    </h1>
                    <div className="flex flex-col text-white">
                      <Button className="mt-6 bg-[#4B9960] text-white">
                        Upload Now
                      </Button>
                      <Button
                        onClick={() => setIsOpen(false)}
                        className="mt-3 bg-white text-black border border-red-500"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </Modal>
              </div>
            </div>
            {/* table */}
            <div className="mt-10 overflow-x-auto">
              {[
                [
                  ["Duration", CardDetail.duration],
                  ["Location", CardDetail.location],
                ],
                [
                  ["Employment", CardDetail.time],
                  ["Deadline", CardDetail.endDate],
                ],
                [
                  ["Start date", CardDetail.startDate],
                  ["Available positions", CardDetail.availablePositions],
                ],
              ].map((row, i) => (
                <div key={i} className="grid grid-cols-2 lg:grid-cols-4">
                  {row.map(([label, value]) => (
                    <div key={label} className="col-span-2">
                      <table className="w-full border-collapse border">
                        <tbody>
                          <tr>
                            <td className="w-1/2 border bg-[#F2F2F2] py-2 px-2">
                              {label}
                            </td>
                            <td className="w-1/2 border text-gray-500 py-2 px-2">
                              {orDash(value)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="mt-8">
              {/* description */}
              <Typography fontSize="lg">Job Descriptions</Typography>
              {descriptionLines.length ? (
                descriptionLines.map((line, i) => (
                  <Typography
                    key={i}
                    fontSize="sm"
                    className="text-gray-600 mt-1"
                  >
                    {line}
                  </Typography>
                ))
              ) : (
                <Typography fontSize="sm" className="text-gray-600 mt-1">
                  No description provided.
                </Typography>
              )}
            </div>
            <div className="mt-8">
              {/* responsibilities */}
              <Typography fontSize="lg">Job Responsibilities</Typography>
              <Typography fontSize="sm" className="text-gray-600 mt-1">
                {responsibilityLines.length ? (
                  <ul className="leading-10">
                    {responsibilityLines.map((line, i) => (
                      <li key={i} className="list-disc ml-4">
                        {line}
                      </li>
                    ))}
                  </ul>
                ) : (
                  "No responsibilities listed."
                )}
              </Typography>
            </div>
          </div>
          <div className="col-span-7 lg:col-span-3 rounded-lg py-10 px-5 border h-[500px] ">
            <div className="flex justify-center items-center flex-col">
              <Image
                src={CardDetail.logo || "/company.svg"}
                alt="company logo"
                width={100}
                height={100}
                unoptimized
                className="rounded-full mb-4"
              />
              <Typography fontSize="lg" className="mt-5">
                {orDash(CardDetail.companyName)}
              </Typography>
            </div>
            <div className="mt-10">
              <Typography className="leading-10 truncate">
                Workplace: {orDash(CardDetail.workplace)}
              </Typography>
              <Typography className="leading-10 truncate">
                Location: {orDash(CardDetail.location)}
              </Typography>
              <Typography className="leading-10 truncate">
                Employees: {orDash(CardDetail.totalEmployees)}
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Detail;
