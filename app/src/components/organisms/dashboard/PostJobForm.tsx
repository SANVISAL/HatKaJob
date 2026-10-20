"use client";
import * as Yup from "yup";
import React, { useEffect, ChangeEvent } from "react";
import { Editor, Typography, Input, Button } from "@/components";
import { useState } from "react";
import { PostJobSchema } from "@/validation/postJob";
import axios from "axios";
import "@/app/globals.css";
import { API_URL } from "@/lib/config";

const initialFormState = {
    companyName: "",
    position: "",
    workplace: "",
    location: "",
    jobDescription: [], // Initialize as empty array for job description
    jobResponsibilities: [], // Initialize as empty array for job responsibilities
    startDate: "",
    endDate: "",
    salary: "50-100", // Default value as an array of two numbers
    totalEmployees: 1, // Default value as a number
    time: "full-time", // Default value as "full-time"
    duration: "1-3", // Default value as a string
    availablePositions: undefined, // Initialize as undefined or specify default value
    gender: "any", // Default value as "any"
};

interface PostJobFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const PostJobForm: React.FC<PostJobFormProps> = ({ onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [formState, setFormState] = useState(initialFormState);

  const [formErrors, setFormErrors] = useState({
    companyName: "",
    position: "",
    workplace: "",
    location: "",
    jobDescription: "",
    jobResponsibilities: "",
    startDate: "",
    endDate: "",
    availablePositions: "", // new field
    gender: "", // new field
    postError: "",
  });

  // Prefill the company name from the employer's company profile
  useEffect(() => {
    axios
      .get(`${API_URL}/v1/companies/profile`, {
        withCredentials: true,
      })
      .then((response) => {
        const companyName = response.data?.data?.companyname;
        if (companyName) {
          setFormState((prev) => ({
            ...prev,
            companyName: prev.companyName || companyName,
          }));
        }
      })
      .catch((error) => console.error("Error fetching company:", error));
  }, []);

  const handleChange =
    (field: keyof typeof formState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setFormState({ ...formState, [field]: e.target.value });

  const handleFocus = (field: keyof typeof formErrors) => () =>
    setFormErrors({ ...formErrors, [field]: "" });

  const handleEditorChange =
    (field: keyof typeof formState, errorField: keyof typeof formErrors) =>
    (content: any) => {
      setFormState({ ...formState, [field]: content });
      if (content !== "") {
        setFormErrors({ ...formErrors, [errorField]: "" });
      }
    };

  const handlePostNowClick = async () => {
    try {
      await PostJobSchema.validate(formState, { abortEarly: false });
      setFormErrors({ ...formErrors, postError: "" });

      setLoading(true);

      // Prepare data to send to backend
      const postData = {
        companyName: formState.companyName,
        position: formState.position,
        workplace: formState.workplace,
        location: formState.location,
        jobDescription: formState.jobDescription,
        jobResponsibilities: formState.jobResponsibilities,
        startDate: formState.startDate,
        endDate: formState.endDate,
        salary: formState.salary,
        totalEmployees: formState.totalEmployees,
        time: formState.time,
        duration: formState.duration,
        availablePositions: formState.availablePositions, // new field
        gender: formState.gender, // new field
      };

      // Send POST request to backend
      const response = await axios.post(
        `${API_URL}/v1/jobs`,
        postData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      // The gateway answers 200 with data: null when the post was not saved
      if (!response.data?.data) {
        throw new Error(response.data?.message || "Job was not saved");
      }

      setLoading(false);
      setFormState({ ...initialFormState, companyName: formState.companyName });
      setSuccessMessage("Job posted successfully!");
      onSuccess?.();
    } catch (error) {
      console.log("error from backend : ", error);

      setLoading(false);

      if (error instanceof Yup.ValidationError) {
        const errors = error.inner.reduce(
          (acc, err) => {
            acc[err.path as keyof typeof formErrors] = err.message;
            return acc;
          },
          { ...formErrors }
        );
        setFormErrors(errors);
      } else if (axios.isAxiosError(error)) {
        // Handle Axios error
        if (error.response) {
          // Server responded with a status other than 2xx
          setFormErrors({
            ...formErrors,
            postError: `Server Error: ${error.response.status} ${
              error.response?.data?.errors?.[0]?.message ?? ""
            }`,
          });
        } else if (error.request) {
          // Request was made but no response was received
          setFormErrors({
            ...formErrors,
            postError: "Network Error: No response received from server",
          });
        } else {
          // Something else happened while setting up the request
          setFormErrors({
            ...formErrors,
            postError: `Error: ${error.message}`,
          });
        }
      } else {
        // Handle other errors
        setFormErrors({
          ...formErrors,
          postError:
            error instanceof Error
              ? error.message
              : "Error Posting. Please try again.",
        });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    handlePostNowClick();
  };

  return (
    <div className="h-auto max-w-[1200px] mx-auto px-5 md:px-10 rounded-lg shadow-sm">
      <div className="text-center mb-4">
        <Typography fontSize="xl" variant="bold" className="text-center my-5">
          Post New Job
        </Typography>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
          {/* companyName */}
          <div className="flex flex-col col-span-2 md:col-span-1">
            <label className="mb-2 text-sm">Company Name</label>
            <div className="flex justify-center flex-col">
              <Input
                type="text"
                placeholder="Company name"
                className={`w-full text-sm ${
                  formErrors.companyName ? "border-red-500" : ""
                }`}
                value={formState.companyName}
                onChange={handleChange("companyName")}
                onFocus={handleFocus("companyName")}
              />
              {formErrors.companyName && (
                <div className=" text-red-500 text-xs mt-1 ">
                  {formErrors.companyName}
                </div>
              )}
            </div>
          </div>
          {/* position */}
          <div className="flex flex-col col-span-2 md:col-span-1">
            <label className="mb-2 text-sm">Position</label>
            <div className="flex flex-col justify-center">
              <Input
                type="text"
                placeholder="Position"
                className={`w-full text-sm ${
                  formErrors.position ? "border-red-500" : ""
                }`}
                value={formState.position}
                onChange={handleChange("position")}
                onFocus={handleFocus("position")}
              />
              {formErrors.position && (
                <div className=" text-red-500 text-xs mt-1 ">
                  {formErrors.position}
                </div>
              )}
            </div>
          </div>
          {/* salary */}
          <div className="flex flex-col col-span-2 md:col-span-1">
            <label className="mb-2 text-sm">Salary</label>
            <div className="flex justify-center">
              <select
                id="salary"
                className="border  text-gray-900 outline-none text-sm rounded-lg block w-full h-[35px]"
                value={formState.salary}
                onChange={handleChange("salary")}
              >
                <option value="50-100">50$-100$</option>
                <option value="100-150">100$-150$</option>
                <option value="150-200">150$-200$</option>
                <option value="negotiable">Negotiable</option>
              </select>
            </div>
          </div>
          {/* total employee */}
          <div className="flex flex-col col-span-2 md:col-span-1">
            <label className="mb-2 text-sm">Total Employees</label>
            <div className="flex justify-center">
              <select
                id="totalEmployees"
                className="border text-[#424242] outline-none text-sm rounded-lg block w-full h-[35px]"
                value={formState.totalEmployees}
                onChange={handleChange("totalEmployees")}
              >
                <option value="1-10">1-10</option>
                <option value="10-20">10-20</option>
                <option value="20-50">20-50</option>
                <option value="100">&#x3e; 100</option>
              </select>
            </div>
          </div>
          {/* time */}
          <div className="flex flex-col col-span-2 md:col-span-1">
            <label className="mb-2 text-sm">Time</label>
            <div className="flex justify-center">
              <select
                id="time"
                className="border  text-gray-900 outline-none text-sm rounded-lg block w-full h-[35px]"
                value={formState.time}
                onChange={handleChange("time")}
              >
                <option value="full-time">Full time</option>
                <option value="part-time">Part time</option>
              </select>
            </div>
          </div>
          {/* work place */}
          <div className="flex flex-col col-span-2 md:col-span-1">
            <label className="mb-2 text-sm">Work Place</label>
            <div className="flex flex-col justify-center">
              <Input
                type="text"
                placeholder="Work Place"
                className={`w-full text-sm ${
                  formErrors.workplace ? "border-red-500" : ""
                }`}
                value={formState.workplace}
                onChange={handleChange("workplace")}
                onFocus={handleFocus("workplace")}
              />
              {formErrors.workplace && (
                <div className=" text-red-500 text-xs mt-1 ">
                  {formErrors.workplace}
                </div>
              )}
            </div>
          </div>
          {/* duration */}
          <div className="flex flex-col col-span-2 md:col-span-1">
            <label className="mb-2 text-sm">Duration</label>
            <select
              id="duration"
              className="border  text-gray-900 outline-none text-sm rounded-lg block w-full h-[35px]"
              value={formState.duration}
              onChange={handleChange("duration")}
            >
              <option value="1-3">1-3 months</option>
              <option value="3-6">3-6 months</option>
              <option value="6-9">6-9 months</option>
            </select>
          </div>
          {/* location */}
          <div className="flex flex-col col-span-2 md:col-span-1">
            <label className="mb-2 text-sm">Location</label>
            <div className="flex flex-col justify-center">
              <Input
                type="text"
                placeholder="Location"
                className={`w-full text-sm ${
                  formErrors.location ? "border-red-500" : ""
                }`}
                value={formState.location}
                onChange={handleChange("location")}
                onFocus={handleFocus("location")}
              />
              {formErrors.location && (
                <div className=" text-red-500 text-xs mt-1 ">
                  {formErrors.location}
                </div>
              )}
            </div>
          </div>
          {/* start date */}
          <div className="flex flex-col col-span-2 md:col-span-1">
            <label className="mb-2 text-sm">Start</label>
            <div className="flex flex-col justify-center">
              <input
                type="date"
                className={`border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2 mt-1 outline-none ${
                  formErrors.startDate && !formState.startDate
                    ? "border-red-500"
                    : ""
                }`}
                value={formState.startDate}
                onChange={handleChange("startDate")}
                onFocus={handleFocus("startDate")}
              />
            </div>
            {formErrors.startDate && (
              <div className="text-red-500 text-xs mt-1">
                {formErrors.startDate}
              </div>
            )}
          </div>
          {/* end date */}
          <div className="flex flex-col col-span-2 md:col-span-1">
            <label className="mb-2 text-sm">End</label>
            <div className="flex flex-col justify-center">
              <input
                type="date"
                className={`border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2 mt-1 outline-none ${
                  formErrors.endDate && !formState.endDate
                    ? "border-red-500"
                    : ""
                }`}
                value={formState.endDate}
                onChange={handleChange("endDate")}
                onFocus={handleFocus("endDate")}
              />
            </div>
            {formErrors.endDate && (
              <div className="text-red-500 text-xs mt-1">
                {formErrors.endDate}
              </div>
            )}
          </div>
          {/* available positions */}
          <div className="flex flex-col col-span-2 md:col-span-1">
            <label className="mb-2 text-sm">Available Positions</label>
            <div className="flex flex-col justify-center">
              <Input
                type="number"
                placeholder="Available Positions"
                className={`w-full text-sm ${
                  formErrors.availablePositions ? "border-red-500" : ""
                }`}
                value={formState.availablePositions}
                onChange={handleChange("availablePositions")}
                onFocus={handleFocus("availablePositions")}
              />
              {formErrors.availablePositions && (
                <div className="text-red-500 text-xs mt-1">
                  {formErrors.availablePositions}
                </div>
              )}
            </div>
          </div>
          {/* gender */}
          <div className="flex flex-col col-span-2 md:col-span-1">
            <label className="mb-2 text-sm">Gender</label>
            <div className="flex justify-center">
              <select
                id="gender"
                className="border  text-gray-900 outline-none text-sm rounded-lg block w-full h-[35px]"
                value={formState.gender}
                onChange={handleChange("gender")}
              >
                <option value="any">Any</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>
        {/* jobDescription */}
        <div className="mt-4">
          <label className="mb-2 text-sm">Job description</label>
          <Editor
            value={formState.jobDescription}
            onChange={handleEditorChange("jobDescription", "jobDescription")}
            className={`h-[200px] ${
              formErrors.jobDescription ? "border-red-500" : ""
            }`}
          />
          {formErrors.jobDescription && (
            <div className="text-red-500 text-xs mt-10">
              {formErrors.jobDescription}
            </div>
          )}
        </div>
        {/* jobResponsibilities */}
        <div className="mt-14">
          <label className="mb-2 text-sm">Job Responsibilities</label>
          <Editor
            value={formState.jobResponsibilities}
            onChange={handleEditorChange(
              "jobResponsibilities",
              "jobResponsibilities"
            )}
            className={`h-[200px] ${
              formErrors.jobResponsibilities ? "border-red-500" : ""
            }`}
          />
          {formErrors.jobResponsibilities && (
            <div className="text-red-500 text-xs mt-10">
              {formErrors.jobResponsibilities}
            </div>
          )}
        </div>
        {formErrors.postError && (
          <div className="text-red-500 text-sm mt-14">
            {formErrors.postError}
          </div>
        )}
        {successMessage && (
          <div className="text-green-600 text-sm mt-14">{successMessage}</div>
        )}
        <div className=" flex justify-end items-end mt-14">
          {/* type="button" so Cancel doesn't submit the form */}
          <Button
            type="button"
            colorOutline="danger"
            className="mr-3 w-24 rounded-lg"
            onClick={() => onCancel?.()}
          >
            Cancel
          </Button>
          <Button
            colorScheme="primary"
            className="w-24 text-white rounded-lg"
            type="submit"
          >
            {loading ? <div className="spinner"></div> : "Post Now"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export { PostJobForm };
