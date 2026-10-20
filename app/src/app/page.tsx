import React from "react";
import { Banner, CardReview, Footer, Nav } from "@/components";
import "./globals.css";
import CardTip from "@/components/molecules/Card/CardTip";
import CardList from "@/components/molecules/Card/CardList";
import CardContext from "@/contexts/CardInfoContext";
import { Toaster } from "@/components/ui/toaster";
import { getProfileUser, getJobs } from "@/lib/serverApi";

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
