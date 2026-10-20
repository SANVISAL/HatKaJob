import { cookies, headers } from "next/headers";
import axios from "axios";
import { API_URL } from "@/lib/config";

// Server-side only helpers for calling the API gateway from server components.

const GATEWAY_URL = API_URL;

// Every server-side request reaches the gateway from this server's IP, so
// without this the gateway's per-IP rate limit would count all visitors as
// one. Forward the visitor's IP (the gateway trusts one proxy hop). Use the
// last entry: it's the one added by the nearest proxy, the rest can be forged.
function forwardedFor(): Record<string, string> {
  const xff = headers().get("x-forwarded-for");
  const ip = xff?.split(",").pop()?.trim();
  return ip ? { "X-Forwarded-For": ip } : {};
}

// Forwards the visitor's session cookies so the gateway knows who is asking
async function getWithSession(path: string) {
  const cookieStore = cookies();
  const session = cookieStore.get("session");
  const sigSession = cookieStore.get("session.sig");

  // Logged-out visitors have no session, so skip the round trip entirely
  if (!session || !sigSession) return undefined;

  try {
    const response = await axios.get(`${GATEWAY_URL}${path}`, {
      headers: {
        Cookie: `${session.name}=${session.value}; ${sigSession.name}=${sigSession.value}`,
        ...forwardedFor(),
      },
    });
    return response.data?.data ?? undefined;
  } catch (error) {
    console.error(`getWithSession(${path}) error: `, error);
    return undefined;
  }
}

export function getProfileUser() {
  return getWithSession("/v1/users/profile");
}

export function getCompanyProfile() {
  return getWithSession("/v1/companies/profile");
}

export async function getJobs() {
  try {
    const response = await axios.get(`${GATEWAY_URL}/v1/jobs`, {
      headers: forwardedFor(),
    });
    return Array.isArray(response.data.data) ? response.data.data : [];
  } catch (error) {
    console.error(`getJobs() error: `, error);
    return [];
  }
}
