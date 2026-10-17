"use client";
import React, {
 useEffect,
 useState,
 useCallback,
  Suspense,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Confetti, Typography } from "@/components";
import { motion } from "framer-motion";
import "tailwindcss/tailwind.css"; // Ensure Tailwind CSS is imported

const SignupPage = () => {
  const [showConfetti, setShowConfetti] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const handleConfetti = useCallback(() => {
    setShowConfetti(true);

    if (email) {
      // Set a timer to hide confetti after 1 seconds and redirect to verify page
      const timer = setTimeout(() => {
        router.push(`/send-email?email=${encodeURIComponent(email)}`);
        setShowConfetti(false);
      }, 5000); // Display confetti for 5 seconds

      // Clear the timer when the component is unmounted
      return () => clearTimeout(timer);
    } else {
      // Handle case where email is null
      console.error("Email parameter is missing");
    }
  }, [email, router]);

  useEffect(() => {
    handleConfetti();
  }, [handleConfetti]);

  return (
    <div className="container h-screen flex justify-center items-center flex-col">
      {showConfetti && <Confetti />}
      <div className="flex flex-col justify-center items-center gap-10">
        <motion.h1
          initial={{ y: -50, scale: 0.5, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="text-2xl"
        >
          <Typography className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[28px] text-center">
            CONGRATULATIONS, YOU HAVE SUCCESSFULLY SIGNED UP!
          </Typography>
        </motion.h1>
      </div>
    </div>
  );
};

const SignupSuccess = () => {
  return <Suspense>
    <SignupPage/>
  </Suspense>
};

export default SignupSuccess;
