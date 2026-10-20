import { NextFunction, Request, Response } from "express";
import { errorHandler } from "../error-handle";
import APIError from "@api-gateway/error/api-error";
import { StatusCode } from "../../utils/consts/status-code";

jest.mock("../../utils/logger", () => ({
  logger: { error: jest.fn() },
}));

describe("errorHandler middleware", () => {
  let res: Partial<Response>;
  const req = {} as Request;
  const next = jest.fn() as NextFunction;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  test("should respond with the custom error's status code and message", () => {
    errorHandler(
      new APIError("Please login", StatusCode.Unauthorized),
      req,
      res as Response,
      next
    );

    expect(res.status).toHaveBeenCalledWith(StatusCode.Unauthorized);
    expect(res.json).toHaveBeenCalledWith({
      errors: [{ message: "Please login" }],
    });
  });

  test("should hide the details of unexpected errors behind a 500", () => {
    errorHandler(new Error("db password wrong"), req, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(StatusCode.InternalServerError);
    expect(res.json).toHaveBeenCalledWith({
      errors: [{ message: "An unexpected error occurred" }],
    });
  });
});
