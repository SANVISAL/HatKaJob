import fs from "fs";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { generateKeyPairSync } from "crypto";

// bcrypt is a native module; we only test our wrappers around it
jest.mock("bcrypt", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock("../config", () => ({
  __esModule: true,
  default: () => ({ jwtExpiresIn: "1h" }),
}));

// jwt.ts reads private_key.pem when it loads, so hand it a throwaway key pair
const keys = generateKeyPairSync("rsa", {
  modulusLength: 2048,
  privateKeyEncoding: { type: "pkcs8", format: "pem" },
  publicKeyEncoding: { type: "spki", format: "pem" },
});

let jwtUtils: typeof import("../jwt");

beforeAll(() => {
  const realReadFileSync = fs.readFileSync;
  jest
    .spyOn(fs, "readFileSync")
    .mockImplementation(((filePath: fs.PathOrFileDescriptor, options?: any) =>
      String(filePath).endsWith("private_key.pem")
        ? keys.privateKey
        : realReadFileSync(filePath, options)) as typeof fs.readFileSync);
  jest.isolateModules(() => {
    jwtUtils = require("../jwt");
  });
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe("password helpers", () => {
  test("should hash the password with 10 salt rounds", async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashed");

    await expect(jwtUtils.generatePassword("secret123")).resolves.toBe(
      "hashed"
    );
    expect(bcrypt.hash).toHaveBeenCalledWith("secret123", 10);
  });

  test("should compare the entered password with the saved hash", async () => {
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    await expect(
      jwtUtils.ValidatePassword({
        enterPassword: "secret123",
        savedPassword: "hashed",
      })
    ).resolves.toBe(true);
    expect(bcrypt.compare).toHaveBeenCalledWith("secret123", "hashed");
  });

  test("should report a wrong password as invalid", async () => {
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      jwtUtils.ValidatePassword({
        enterPassword: "wrong-password",
        savedPassword: "hashed",
      })
    ).resolves.toBe(false);
  });
});

describe("generateSignature", () => {
  test("should sign an RS256 token that carries the id and role", async () => {
    const token = await jwtUtils.generateSignature({
      id: "user-1",
      role: "seeker",
    });

    const decoded = jwt.verify(token, keys.publicKey, {
      algorithms: ["RS256"],
    }) as { payload: { id: string; role: string }; exp: number; iat: number };

    expect(decoded.payload).toEqual({ id: "user-1", role: "seeker" });
    expect(decoded.exp - decoded.iat).toBe(60 * 60);
  });
});
