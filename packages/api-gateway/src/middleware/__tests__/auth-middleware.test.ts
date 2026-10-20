import { Request, Response } from "express";
import { sign } from "jsonwebtoken";
import { verifyUser } from "../auth-middleware";
import APIError from "@api-gateway/error/api-error";
import { StatusCode } from "../../utils/consts";

// The real server reads public_key.pem and boots the app; use a throwaway pair
jest.mock("../../server", () => {
  const { generateKeyPairSync } = require("crypto");
  const keys = generateKeyPairSync("rsa", {
    modulusLength: 2048,
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
    publicKeyEncoding: { type: "spki", format: "pem" },
  });
  return { publicKey: keys.publicKey, testPrivateKey: keys.privateKey };
});
jest.mock("../../utils/logger", () => ({
  logger: { error: jest.fn(), info: jest.fn() },
}));

const { testPrivateKey } = jest.requireMock("../../server");

const signToken = (expiresIn: string | number = "1h") =>
  sign({ payload: { id: "user-1", role: "seeker" } }, testPrivateKey, {
    algorithm: "RS256",
    expiresIn,
  });

const request = ({
  session,
  persistent,
}: {
  session?: string;
  persistent?: string;
}) =>
  ({
    session: session ? { jwt: session } : {},
    cookies: persistent ? { persistent } : {},
  }) as unknown as Request;

describe("verifyUser middleware", () => {
  let next: jest.Mock;
  const res = {} as Response;

  beforeEach(() => {
    next = jest.fn();
  });

  test("should call next() for a valid session token", async () => {
    await verifyUser(request({ session: signToken() }), res, next);

    expect(next).toHaveBeenCalledWith();
  });

  test("should fall back to the persistent cookie and restore the session", async () => {
    const token = signToken();
    const req = request({ persistent: token });

    await verifyUser(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.session!.jwt).toEqual(token);
  });

  test("should pass a 401 APIError to next() when there is no token", async () => {
    await verifyUser(request({}), res, next);

    const error = next.mock.calls[0][0];
    expect(error).toBeInstanceOf(APIError);
    expect(error.getStatusCode()).toBe(StatusCode.Unauthorized);
  });

  test("should pass the error to next() for an expired token", async () => {
    await verifyUser(request({ session: signToken(-10) }), res, next);

    expect(next.mock.calls[0][0]).toMatchObject({ name: "TokenExpiredError" });
  });

  test("should reject a token signed with a different key", async () => {
    const { generateKeyPairSync } = require("crypto");
    const otherKey = generateKeyPairSync("rsa", {
      modulusLength: 2048,
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
      publicKeyEncoding: { type: "spki", format: "pem" },
    }).privateKey;
    const forged = sign({ payload: { id: "x", role: "employer" } }, otherKey, {
      algorithm: "RS256",
    });

    await verifyUser(request({ session: forged }), res, next);

    expect(next.mock.calls[0][0]).toMatchObject({ name: "JsonWebTokenError" });
  });
});
