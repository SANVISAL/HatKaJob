"use client";
import { Button, Typography } from "@/components";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
import { Suspense } from "react";

const SendEmailPage = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const handleGoToEmail = () => {
    if (email) {
      const emailProvider = email.split("@")[1];
      const redirectTo = emailProvider.includes("gmail")
        ? "https://mail.google.com"
        : `https://mail.${emailProvider}`;
      window.location.href = redirectTo;
    }
  };

  return (
    <div className="w-full lg:container h-screen flex flex-col items-center">
      <div className="container my-10">
        <Link href="/">
          {/* logo */}
          <Image src="/logo.svg" alt="please verify" width={60} height={60} />
        </Link>
      </div>
      <div className="flex-grow flex flex-col justify-center items-center">
        <Image
          src="/auth/please-verify.svg"
          alt="please verify"
          width={100}
          height={100}
          className="w-[256px] h-[260px]"
        />
        <div className="flex flex-col justify-center items-center gap-8 px-2 lg:px-10">
          <Typography fontSize="2xl" variant="black">
            Verify your email to continue
          </Typography>
          <Typography fontSize="base" className="text-center w-full lg:w-8/12">
            We just sent an email to the address:
            <span className="font-bold mx-1">{email}</span>
            Please check your email and select the link provided to verify your
            email address
          </Typography>
        </div>
        <div className="flex gap-5 mt-8">
          <Button type="button" colorOutline="primary" rounded="lg" size="md">
            Send again
          </Button>
          <Button
            type="button"
            colorOutline="none"
            rounded="lg"
            size="md"
            colorScheme="primary"
            textColor="white"
            onClick={handleGoToEmail}
          >
            Go to Gmail
          </Button>
        </div>
      </div>
    </div>
  );
};

const SendEmail = () => {
  return (
    <Suspense>
      <SendEmailPage />
    </Suspense>
  );
};

export default SendEmail;
