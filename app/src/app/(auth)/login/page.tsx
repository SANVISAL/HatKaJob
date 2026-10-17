"use client";
import * as Yup from "yup";

import React, { useState } from "react";
import Link from "next/link";
import { LoginSchema } from "../../../validation/loginValidate";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaFacebook } from "react-icons/fa";
import Image from "next/legacy/image";
import "../../globals.css";
import { Icon } from "@/components";
import axios from "axios";
import { useRouter } from "next/navigation";

const Login = () => {
  const [loginError, setLoginError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      // Display errors if any field is empty
      if (!email) setEmailError("Email is required");
      if (!password) setPasswordError("Password is required");
      return;
    }

    setLoading(true);
    setLoginError("");

    try {
      await LoginSchema.validate({ email, password }, { abortEarly: false });

      const response = await axios.post(
        "http://localhost:4000/v1/auth/login",
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      // Clear errors upon successful login
      setEmailError("");
      setPasswordError("");

      const { role, token } = response.data;
      console.log("Logging in with:", { email, password, role });

      if (role === "seeker") {
        // router.push("/");
        window.location.href='/';
      } else if (role === "employer") {
        window.location.href = "/dashboard";
        // router.push("/dashboard");
      } else {
        setLoginError("Invalid user role");
      }
    } catch (error: any) {
      if (error instanceof Yup.ValidationError) {
        error.inner.forEach((e: any) => {
          switch (e.path) {
            case "email":
              setEmailError(e.message);
              break;
            case "password":
              setPasswordError(e.message);
              break;
            default:
              break;
          }
        });
      } else {
        setLoginError("Invalid email or password");
        setLoading(false);
      }
    }
  };

  // **Clear Errors on Focus**
  const handleEmailFocus = () => setEmailError("");
  const handlePasswordFocus = () => setPasswordError("");

  return (
    <div className="flex h-screen mx-auto overflow-hidden">
      {/* Use flexbox to make it full height */}
      <div className="left hidden lg:block w-full h-full p-10 bg-[#18181B] flex-col justify-between rounded-r-2xl">
        {/* <div>⚛</div> */}
        <div className="flex justify-center items-center h-screen">
          <Image
            src="/auth/login.svg"
            alt="login"
            width={450}
            height={450}
            className="mb-20"
          />
        </div>
      </div>
      <div className="right w-full p-10">
        <div className="text-end">
          <Link
            href="/role"
            color="primary"
            className="text-sm text-blue-500 underline"
          >
            Sign Up
          </Link>
        </div>
        <div className="flex flex-col justify-center items-center h-full">
          {" "}
          {/* Use flexbox to make it full height */}
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="logo"
              width={50}
              height={50}
              className="-mt-20 mb-10"
            />
          </Link>
          <div className="text-center">
            <h1 className="font-bold mb-1 text-lg mt-5">Log in to Neakhatka</h1>
            <p className="text-gray-500 text-sm">
              Enter your email and password below to login <br /> your account
            </p>
          </div>
          <form onSubmit={handleSubmit} className="mt-5">
            <div className="relative">
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="example@gmail.com"
                className={`w-[350px] ${emailError ? "border-red-500" : ""}`}
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                onFocus={handleEmailFocus}
              />
              {emailError && (
                <div className="text-red-500 text-xs mt-1">{emailError}</div>
              )}
            </div>
            <div className="relative mt-4">
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="password123"
                className={`w-[350px] ${passwordError ? "border-red-500" : ""}`}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                onFocus={handlePasswordFocus}
              />
              {passwordError && (
                <div className="text-red-500 text-xs mt-1">{passwordError}</div>
              )}
            </div>
            <Link
              href="/forgot-password"
              className="flex justify-end text-blue-600 -mb-5 mt-2 text-sm underline"
            >
              forgot password?
            </Link>
            <br />
            {loginError && !emailError && !passwordError && (
              <div className="text-red-500 text-xs mt-1">{loginError}</div>
            )}
            <Button
              type="submit"
              className="mt-4 w-[350px] bg-[#343A40] hover:bg-[#4a535c]"
              disabled={loading}
            >
              {loading ? <div className="spinner"></div> : "Login"}
            </Button>
          </form>
          <div className="mt-5">
            <span className="flex text-gray-300">or continue with</span>
          </div>
          <div className="flex flex-col w-[350px]">
            <Button
              className="mt-4 mb-2 flex justify-center items-center"
              variant="outline"
            >
              <Icon label="Google" className="-ml-10 mr-5" />
              Continue with Google
            </Button>

            <Button
              className="flex justify-center items-center"
              variant="outline"
            >
              <FaFacebook className="-ml-6 mr-5 w-[22px] h-[22px] text-blue-600" />
              Continue with facebook
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
