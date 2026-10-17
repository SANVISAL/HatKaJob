"use client";
import { Button, Typography, Confetti } from "@/components"; // Import Confetti
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const VerifyPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [verificationStatus, setVerificationStatus] =
    useState<string>("verifying");
  const hasRun = useRef(false); // Track if the effect has already run

  const verifyEmailToken = async (token: string) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/v1/auth/verify?token=${token}`,
        {
          withCredentials: true,
        }
      );

      console.log("response : ", response);

      return response.data;
    } catch (error) {
      console.error("Error verifying email:", error);
      return {
        error,
        status: "error",
        message: "Error verifying email. Please try again.",
      };
    }
  };

  const handleEmail = async () => {
    if (token) {
      setVerificationStatus("verifying");
      const response = await verifyEmailToken(token);
      console.log("Verification response:", response);
      if (response.status === "success") {
        setVerificationStatus("success");
        setTimeout(() => {
          if (response.role === "seeker") {
            window.location.href = "/";
            // router.push("/");
          } else if (response.role === "employer") {
            window.location.href = "/dashboard";
            // router.push("/dashboard");
          } else {
            setVerificationStatus("error");
          }
        }, 5000); // Delay redirection to show confetti
      } else {
        setVerificationStatus("error");
      }
    } else {
      setVerificationStatus("no-token");
    }
  };

  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true;
      handleEmail();
    }
  });

  const renderContent = () => {
    switch (verificationStatus) {
      case "verifying":
        return "Please wait, we're verifying your email...";
      case "success":
        return "Your email has been verified successfully!";
      case "error":
        return "There was an error verifying your email. Please try again.";
      case "no-token":
        return "Invalid or missing token.";
      default:
        return "An unknown error occurred.";
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center">
      <div className="container flex justify-start p-10 mt-10 lg:mt-20">
        <Link href="/">
          <Image src="/logo.svg" alt="logo" width={60} height={60} />
        </Link>
      </div>
      <div className="flex-grow flex justify-center items-center">
        <div className="flex flex-col justify-center items-center gap-10 -mt-20 lg:-mt-32">
          <Image
            src="/auth/signup.svg"
            alt="please verify"
            width={100}
            height={100}
            className="w-[256px] h-[260px]"
          />
          <div className="flex justify-center items-center flex-col gap-8 px-2 lg:px-10 text-center">
            <Typography fontSize="2xl" variant="black">
              {renderContent()}
            </Typography>
            {verificationStatus === "success" && <Confetti />}{" "}
            {/* Show confetti on success */}
          </div>
        </div>
      </div>
    </div>
  );
};

const VerifyEmail = () => {
  return (
    <>
      <Suspense>
        <VerifyPage />
      </Suspense>
    </>
  );
};

export default VerifyEmail;
