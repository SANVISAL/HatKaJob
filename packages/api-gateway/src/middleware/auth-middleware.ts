import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../utils/consts";
import { logger } from "../utils/logger";
import { verify } from "jsonwebtoken";
import { publicKey } from "../server";
import APIError from "@api-gateway/error/api-error";

async function verifyUser(req: Request, _res: Response, _next: NextFunction) {
  const sessionCookie = req.session?.jwt;
  const persistentCookie = req.cookies?.persistent;

  try {
    if (!sessionCookie) {
      if (!persistentCookie) {
        logger.error(
          "Token is not available. Gateway Service verifyUser() method error "
        );
        throw new APIError(
          "Please login to access this resource.",
          StatusCode.Unauthorized
        );
      }
      (req as Request).session!.jwt = persistentCookie;
    }
    // Use the same token verification logic you're currently using
    await verify(sessionCookie || persistentCookie, publicKey, {
      algorithms: ["RS256"],
    });
    // If the token is valid, proceed to the next middleware
    _next();
  } catch (error) {
    _next(error);
  }
}

export { verifyUser };
