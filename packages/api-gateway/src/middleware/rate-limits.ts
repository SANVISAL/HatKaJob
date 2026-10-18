import { rateLimit } from "express-rate-limit";
import express from "express";

const limiterOptions = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes in milliseconds
  // Each page view makes 1-3 requests, so leave room for active visitors
  max: 500, // Limit each IP to 500 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});

export const applyRateLimit = (app: express.Application) => {
  app.use(limiterOptions);
};
