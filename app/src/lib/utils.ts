import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Profile pictures are stored as a Mongo Buffer, which arrives as JSON
// like { type: "Buffer", data: [...] }. Turn it into an <img>-ready URL.
export function bufferToDataUrl(buffer?: { data?: number[] } | null) {
  if (!buffer?.data?.length) return undefined
  let binary = ""
  buffer.data.forEach((byte) => (binary += String.fromCharCode(byte)))
  const base64 =
    typeof window === "undefined"
      ? Buffer.from(binary, "binary").toString("base64")
      : window.btoa(binary)
  return `data:image/jpeg;base64,${base64}`
}
