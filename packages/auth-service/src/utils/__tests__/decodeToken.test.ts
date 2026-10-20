import jwt from "jsonwebtoken";
import { privatekey } from "../../server";
import { decodedToken } from "../decodeToken";
import APIError from "../../errors/api-error";

// Importing the real server would read private_key.pem and boot the app
jest.mock("../../server", () => {
  const { generateKeyPairSync } = require("crypto");
  const { privateKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
    publicKeyEncoding: { type: "spki", format: "pem" },
  });
  return { privatekey: privateKey };
});

describe("decodedToken", () => {
  beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test("should return the id and role from a valid token", async () => {
    const token = jwt.sign(
      { payload: { id: "user-1", role: "employer" } },
      privatekey,
      { algorithm: "RS256", expiresIn: "1h" }
    );

    await expect(decodedToken(token)).resolves.toEqual({
      id: "user-1",
      role: "employer",
    });
  });

  test("should throw an APIError for a malformed token", async () => {
    await expect(decodedToken("not-a-token")).rejects.toBeInstanceOf(
      APIError
    );
  });

  test("should throw an APIError for an expired token", async () => {
    const token = jwt.sign(
      { payload: { id: "user-1", role: "seeker" } },
      privatekey,
      { algorithm: "RS256", expiresIn: -10 }
    );

    await expect(decodedToken(token)).rejects.toThrow("Can't Decode token!");
  });
});
