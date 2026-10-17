"use client";
import React, { useEffect, useState } from "react";
import Image from "next/legacy/image";
import Link from "next/link";
import { Icon } from "@/components";
import { Typography } from "../../atoms/Typography";
import { motion } from "framer-motion";
import { IUserProfile } from "@/Types/UserProfile";
import { useToast } from "@/components/ui/use-toast";

interface CardData {
  id: string;
  companyId: string;
  companyLogo: string;
  position: string;
  jobDescription: string;
  location: string;
  time: string;
  salary: string;
  availablePositions: number;
  totalEmployees: number;
  duration: string;
  gender: string;
  jobResponsibilities: string[];
  startDate: string;
  endDate: string;
}

interface CardProps {
  className?: string;
  data: CardData; // Use the new interface
  iconType?: "star" | "close" | "StarFill";
  userProfile: IUserProfile;
  onDelete?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Card: React.FC<CardProps> = ({
  className = "",
  data,
  iconType = "star",
  userProfile,
  onDelete,
}) => {
  const {
    id,
    companyId,
    companyLogo,
    position,
    jobDescription,
    location,
    time,
    salary,
    availablePositions,
    totalEmployees,
    duration,
    gender,
    jobResponsibilities,
    startDate,
    endDate,
  } = data;

  const [isFavorited, setIsFavorited] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { toast } = useToast();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(e);
    }
  };

  const handleStarClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if cookies are set
    if (userProfile) {
      // Toggle the isFavorited state
      setIsFavorited((prev) => !prev);

      // Check if Favorite
      if (isFavorited) {
        // Decrement Favorites
        const totalFavorites = localStorage.getItem(
          "numberOfFavorites"
        ) as string;
        const result = parseInt(totalFavorites) - 1;

        // Set New Total Count of Favorite
        localStorage.setItem("numberOfFavorites", result.toString());

        // Notify Event Storage So That Listener could know total favorite is changing
        window.dispatchEvent(new Event("storage"));
      } else {
        // Increment Favorites
        const totalFavorites = localStorage.getItem("numberOfFavorites")
          ? (localStorage.getItem("numberOfFavorites") as string)
          : "0";
        const result = parseInt(totalFavorites) + 1;

        // Set New Total Count of Favorite
        localStorage.setItem("numberOfFavorites", result.toString());

        // Notify Event Storage So That Listener could know total favorite is changing
        window.dispatchEvent(new Event("storage"));
        toast({
          description: isFavorited
            ? "Removed from favorites successfully."
            : "Added to favorite successfully.",
        });
      }
    } else {
      // Display a message to the user indicating that they need to enable cookies
      // alert("Please enable cookies to use this feature.");
      // You can also use a notification library like 'toast' to display a message to the user
      // Example: toast.error("Please enable cookies to use this feature.");
      toast({
        variant: "destructive",
        title: "Uh oh! You don't have an account",
        description: "Please signup or login first",
      });
    }
  };

  return (
    <motion.div
      className={`h-auto rounded-xl shadow-lg p-5 font-Poppins ${className}`}
      onClick={(e) => {
        e.preventDefault();
      }}
      whileHover={{ scale: 1.025 }}
      whileTap={{ scale: 0.975 }}
      transition={{
        type: "tween",
        duration: 0.3,
        ease: "easeInOut",
      }}
    >
      <Link href={`/detail/${id}`}>
        <div className="flex justify-between items-center">
          <div className="flex">
            <Image
              className="rounded-full"
              src={companyLogo}
              alt="company logo"
              width={48}
              height={48}
            />
            <div className="font-Poppins ml-2">
              <Typography>{position}</Typography>
              <Typography fontSize="sm" className="text-gray-500">
                {totalEmployees} people
              </Typography>
            </div>
          </div>
          <div onClick={handleStarClick}>
            {iconType === "star" ? (
              <button>
                <Icon label={isFavorited ? "StarFill" : "Star"} />
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete(e);
                }}
              >
                <Icon label="Close" />
              </button>
            )}
          </div>
        </div>
        <div className="flex">
          <div>
            <Typography className="mt-5" fontSize="sm">
              Salary
            </Typography>
            <Typography className="text-gray-500" fontSize="sm">
              <div className="flex">
                <Icon className="mr-0.5" label="Dollar" size="sm" />
                {salary}
              </div>
            </Typography>
            <div>
              <Typography className="mt-2" fontSize="sm">
                Employment
              </Typography>
              <Typography className="text-gray-500" fontSize="sm">
                <div className="flex">
                  <Icon className="mr-2" label="Bag" size="sm" />
                  {time}
                </div>
              </Typography>
            </div>
          </div>
          <div className="mx-auto">
            <Typography className="mt-5" fontSize="sm">
              Location
            </Typography>
            <Typography className="text-gray-500" fontSize="sm">
              <div className="flex">
                <Icon className="mr-2" label="Location" size="sm" />
                {location}
              </div>
            </Typography>
            <Typography className="mt-2" fontSize="sm">
              Deadline
            </Typography>
            <Typography className="text-gray-500" fontSize="sm">
              <div className="flex">
                <Icon className="mr-2" label="Calendar" size="sm" />
                {endDate}
              </div>
            </Typography>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export { Card, type CardData, type CardProps };
