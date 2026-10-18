import React from "react";
import { Banner, CardReview, Footer, Nav } from "@/components";
import "./globals.css";
import CardTip from "@/components/molecules/Card/CardTip";
import CardList from "@/components/molecules/Card/CardList";
import CardContext from "@/contexts/CardInfoContext";
import { cookies } from "next/headers";
import axios from "axios";
import { Toaster } from "@/components/ui/toaster";

async function getProfileUser() {
  const cookieStore = cookies();
  const session = cookieStore.get("session");
  const sigSession = cookieStore.get("session.sig");

  // Logged-out visitors have no session, so skip the round trip entirely
  if (!session || !sigSession) return undefined;

  try {
    const response = await axios.get("http://localhost:4000/v1/users/profile", {
      withCredentials: true, // Include cookies if needed!
      headers: {
        Cookie: ` ${session.name}=${session.value}; ${sigSession.name}=${sigSession.value}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`getProfileUser() Method error: `, error);
    return undefined;
  }
}

async function getJobs() {
  try {
    const response = await axios.get("http://localhost:4000/v1/jobs");
    return Array.isArray(response.data.data) ? response.data.data : [];
  } catch (error) {
    console.error(`getJobs() Method error: `, error);
    return [];
  }
}

export default async function Home() {
  // Run both requests in parallel instead of one after another
  const [result, jobs] = await Promise.all([getProfileUser(), getJobs()]);
  // console.log("result", result);

  return (
    <>
      <Toaster />
      <Nav userProfile={result} />
      <CardContext>
        <Banner />
        <CardTip />
        <CardList userProfile={result} initialJobs={jobs} />
        <CardReview />
      </CardContext>
      <Footer />
    </>
  );
}
