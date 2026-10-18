import { cookies } from "next/headers";
import axios from "axios";

// Server-side only: forwards the visitor's session cookies to the API gateway
async function getWithSession(url: string) {
  const cookieStore = cookies();
  const session = cookieStore.get("session");
  const sigSession = cookieStore.get("session.sig");

  // Logged-out visitors have no session, so skip the round trip entirely
  if (!session || !sigSession) return undefined;

  try {
    const response = await axios.get(url, {
      headers: {
        Cookie: `${session.name}=${session.value}; ${sigSession.name}=${sigSession.value}`,
      },
    });
    return response.data?.data ?? undefined;
  } catch (error) {
    console.error(`getWithSession(${url}) error: `, error);
    return undefined;
  }
}

export function getProfileUser() {
  return getWithSession("http://localhost:4000/v1/users/profile");
}

export function getCompanyProfile() {
  return getWithSession("http://localhost:4000/v1/companies/profile");
}
