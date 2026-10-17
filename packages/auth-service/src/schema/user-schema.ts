import { z } from "zod";

export const UsersignUpSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(8, "password must be least 8 charater"),
  role: z.string(),
});

export const UserSignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "password must be least 8 charater"),
});
