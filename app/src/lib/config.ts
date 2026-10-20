// Base URL of the API gateway. Set NEXT_PUBLIC_API_URL for each deployed
// stage (it is inlined at build time); local development falls back to the
// gateway from docker-compose.
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
