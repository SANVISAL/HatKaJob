require("dotenv").config();

import express from "express";
import axios from "axios";
import { Request, Response } from "express";
import { generateSignature } from "../../utils/jwt";
// Make sure this import matches your exported model
import authentication from "../../database/model/user.repository";

const authRouter = express.Router();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_CLIENT_URL;

// Initiates the Google Login flow
authRouter.get("/google/callback", (_req: Request, res: Response) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=profile email`;
  res.redirect(url);
});

// Callback URL for handling the Google Login response
authRouter.get("/user/google/callback", async (req: Request, res: Response) => {
  const { code } = req.query as { code: string };

  try {
    // Exchange authorization code for access token
    const { data } = await axios.post("https://oauth2.googleapis.com/token", {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    });

    const { access_token } = data;

    // Use access_token to fetch user profile
    const { data: profile } = await axios.get(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    // Check if user already exists in the database based on email
    let user = await authentication.findOne({ email: profile.email });

    if (!user) {
      // Create a new user if not found
      user = new authentication({
        username: profile.given_name, // Assuming the profile has given_name and family_name
        email: profile.email,
        isVerified: true, // Assuming Google OAuth is verified
        googleId: profile.id,
        role: profile.role,
      });

      // Save the new user to the database
      await user.save();
      console.log("User saved to database:", user);
    }

    // Generate JWT token for the user and send it back
    const token = generateSignature({
      id: user._id!.toString(),
      role: user.role,
    }); // Assuming _id is the MongoDB ObjectId of the user
    res.json({ token }); // Send JWT token back to the client
  } catch (error) {
    console.error("Error during Google authentication:", error);
    res.status(500).send("Authentication failed due to server error.");
  }
});

export default authRouter;
