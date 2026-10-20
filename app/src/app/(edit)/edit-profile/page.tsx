"use client";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Typography, Input, Button } from "@/components";
import { bufferToDataUrl } from "@/lib/utils";
import { API_URL } from "@/lib/config";

const PROFILE_URL = `${API_URL}/v1/users/profile`;

// Field names match the profile-service PUT /v1/users/profile form fields
const emptyForm = {
  fullname: "",
  email: "",
  contactphone: "",
  gender: "",
  location: "",
  DOB: "",
  nationality: "",
  address: "",
  educationbackground: "",
};

type FormField = keyof typeof emptyForm;

const fields: {
  name: FormField;
  label: string;
  type: string;
  placeholder: string;
}[] = [
  {
    name: "fullname",
    label: "Name",
    type: "text",
    placeholder: "Your full name",
  },
  { name: "DOB", label: "Date of Birth", type: "date", placeholder: "" },
  {
    name: "contactphone",
    label: "Contact Phone",
    type: "text",
    placeholder: "012 345 678",
  },
  {
    name: "nationality",
    label: "Nationality",
    type: "text",
    placeholder: "Khmer",
  },
  {
    name: "gender",
    label: "Gender",
    type: "text",
    placeholder: "Male / Female / Other",
  },
  {
    name: "email",
    label: "Contact Email",
    type: "email",
    placeholder: "you@example.com",
  },
  {
    name: "location",
    label: "Location",
    type: "text",
    placeholder: "Phnom Penh",
  },
  {
    name: "address",
    label: "Address",
    type: "text",
    placeholder: "Street, district, city",
  },
];

const EditProfile = () => {
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [picture, setPicture] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(PROFILE_URL, {
          withCredentials: true,
        });
        const profile = response.data.data;
        if (!profile) {
          router.push("/login");
          return;
        }
        setForm({
          fullname: profile.fullname || "",
          email: profile.email || "",
          contactphone: profile.contactphone || "",
          gender: profile.gender || "",
          location: profile.location || "",
          DOB: profile.DOB || "",
          nationality: profile.nationality || "",
          address: profile.address || "",
          educationbackground: profile.educationbackground || "",
        });
        setPreview(bufferToDataUrl(profile.profile));
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Unable to load your profile. Please log in again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleChange =
    (field: FormField) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [field]: e.target.value });

  const handlePictureChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPicture(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (saving) return;
    if (!form.fullname || !form.email) {
      setError("Name and email are required.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));
      if (picture) data.append("profile", picture);

      const response = await axios.put(PROFILE_URL, data, {
        withCredentials: true,
      });
      // The gateway returns 200 even when the update failed, with data: null
      if (!response.data.data) {
        throw new Error(response.data.message || "Update failed");
      }
      router.push("/seeker-profile");
      router.refresh();
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Unable to save your profile. Please try again.");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center items-center mx-auto py-10">
      <form
        onSubmit={handleSubmit}
        className="max-w-[880px] w-full mx-auto rounded-lg shadow-sm p-4"
      >
        <Typography fontSize="xl" className="text-center ">
          Edit Profile
        </Typography>
        <Typography
          fontSize="sm"
          className="text-center mb-4 py-5 px-0 md:px-14"
        >
          Companies will see these details when you apply for an internship.
        </Typography>
        {/* image */}
        <div className="flex flex-col items-center justify-center mb-4">
          <label htmlFor="profilePicture" className="cursor-pointer">
            <Image
              src={preview || "/userProfile/seeker.svg"}
              alt="profile picture"
              width={105}
              height={105}
              unoptimized
              className="h-[105px] w-[105px] rounded-full object-cover mb-2"
            />
          </label>
          <input
            id="profilePicture"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePictureChange}
          />
          <label
            htmlFor="profilePicture"
            className="text-sm text-[#4B9960] cursor-pointer"
          >
            Change picture
          </label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map(({ name, label, type, placeholder }) => (
            <div key={name} className="flex flex-col">
              <label htmlFor={name} className="mb-2 text-sm">
                {label}
              </label>
              <Input
                id={name}
                type={type}
                placeholder={placeholder}
                value={form[name]}
                onChange={handleChange(name)}
                className="text-sm w-full"
              />
            </div>
          ))}
        </div>
        <div className="my-4">
          <label htmlFor="educationbackground" className="mb-2 text-sm">
            Education background
          </label>
          <textarea
            id="educationbackground"
            rows={4}
            value={form.educationbackground}
            onChange={handleChange("educationbackground")}
            className="p-2 w-full text-sm text-gray-900 rounded-lg border border-gray-300"
            placeholder="e.g. Royal University of Phnom Penh, Computer Science"
          ></textarea>
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="flex justify-end">
          <Button
            type="button"
            colorOutline="danger"
            size="md"
            className="mr-3"
            rounded="lg"
            onClick={() => router.push("/seeker-profile")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            colorScheme="primary"
            className="w-48 text-white"
          >
            {saving ? "Saving..." : "Save change"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
