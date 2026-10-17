import jwt from "jsonwebtoken";
import { logger } from "./logger";
import APIError from "../errors/api-error";
import { privatekey } from "../server";

export const decodedToken = async (token: string) => {
  try {
    if (!privatekey) {
      throw new APIError("Private key is missing or invalid!");
    }

    const decodedPayload = jwt.verify(token, privatekey, {
      algorithms: ["RS256"],
    }) as {
      payload: {
        id: string;
        role: string;
      };
      iat: number;
      exp: number;
    };

    console.log("decodedPayload : ", decodedPayload);

    const datapayload = {
      role: decodedPayload.payload.role,
      id: decodedPayload.payload.id,
    };

    console.log("id from token: ", datapayload.id);
    console.log("role from token: ", datapayload.role);
    console.log("datapayload: ", datapayload);
    return datapayload;
  } catch (error: unknown) {
    if (error instanceof jwt.JsonWebTokenError) {
      logger.error("JWT Error in decodeToken() method:", error.message);
    } else if (error instanceof jwt.TokenExpiredError) {
      logger.error(
        "JWT Token Expired Error in decodeToken() method:",
        error.message
      );
    } else if (error instanceof jwt.NotBeforeError) {
      logger.error(
        "JWT Not Before Error in decodeToken() method:",
        error.message
      );
    } else {
      logger.error("Unknown Error in decodeToken() method:", error);
    }
    throw new APIError("Can't Decode token!");
  }
};
