import { Request, Response } from "express";
import { authorize, AuthRequest } from "../authmiddleware";
import { decodedToken } from "../../utils/jwt";
import APIError from "../../error/api-error";
import { StatusCode } from "../../utils/consts/status.code";

jest.mock("../../utils/jwt", () => ({
  decodedToken: jest.fn(),
}));
jest.mock("../../utils/logger", () => ({
  logger: { error: jest.fn(), info: jest.fn() },
}));

describe("authorize middleware", () => {
  let res: Partial<Response>;
  let next: jest.Mock;

  const requestWithToken = (token = "token-123"): Partial<Request> => ({
    headers: { authorization: `Bearer ${token}` },
  });

  beforeEach(() => {
    jest.clearAllMocks();
    res = {};
    next = jest.fn();
  });

  test("should attach the decoded seeker and call next() for an allowed role", async () => {
    const decoded = { id: "user-1", role: "seeker" };
    (decodedToken as jest.Mock).mockResolvedValue(decoded);
    const req = requestWithToken();

    await authorize(["seeker"])(req as Request, res as Response, next);

    expect(decodedToken).toHaveBeenCalledWith("token-123");
    expect((req as AuthRequest).seeker).toEqual(decoded);
    expect(next).toHaveBeenCalledWith();
  });

  test("should pass a 403 APIError to next() for a role that isn't allowed", async () => {
    (decodedToken as jest.Mock).mockResolvedValue({ id: "c1", role: "employer" });
    const req = requestWithToken();

    await authorize(["seeker"])(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledTimes(1);
    const error = next.mock.calls[0][0];
    expect(error).toBeInstanceOf(APIError);
    expect(error.getStatusCode()).toBe(StatusCode.Forbidden);
    expect((req as AuthRequest).seeker).toBeUndefined();
  });

  test("should pass a custom error to next() exactly once", async () => {
    const decodeError = new APIError("Can't Decode token!", StatusCode.BadRequest);
    (decodedToken as jest.Mock).mockRejectedValue(decodeError);

    await authorize(["seeker"])(
      requestWithToken() as Request,
      res as Response,
      next
    );

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(decodeError);
  });

  test("should pass a 401 APIError to next() when the token can't be decoded", async () => {
    (decodedToken as jest.Mock).mockRejectedValue(new Error("bad token"));

    await authorize(["seeker"])(
      requestWithToken() as Request,
      res as Response,
      next
    );

    const error = next.mock.calls[0][0];
    expect(error).toBeInstanceOf(APIError);
    expect(error.getStatusCode()).toBe(StatusCode.Unauthorized);
  });
});
