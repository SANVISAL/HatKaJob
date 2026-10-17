import { CookieOptions } from "express";
import getConfig from "./createCofig";

const config = getConfig();

export const OptionCookie: CookieOptions = {
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
  httpOnly: true,
  secure: config.env !== "development", // set to true in production
  sameSite: config.env !== "development" ? "strict" : "lax", // 'strict' in production, 'lax' in development
  domain: config.env !== "development" ? "www.neakhatka.com" : undefined, // Set domain in production, undefined in development
  path: "/", // Ensure the path is set to the root
};
