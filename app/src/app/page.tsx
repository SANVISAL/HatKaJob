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

  try {
    const response = await axios.get("http://localhost:4000/v1/users/profile", {
      withCredentials: true, // Include cookies if needed!
      headers: {
        Cookie: ` ${session!.name}=${session!.value}; ${sigSession!.name}=${
          sigSession!.value
        }`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`getProfileUser() Method error: `, error);
    return undefined;
  }
}

export default async function Home() {
  const result = await getProfileUser();
  // console.log("result", result);

  return (
    <>
      <Toaster />
      <Nav userProfile={result} />
      <CardContext>
        <Banner />
        <CardTip />
        <CardList userProfile={result} />
        <CardReview />
      </CardContext>
      <Footer />
    </>
  );
}
