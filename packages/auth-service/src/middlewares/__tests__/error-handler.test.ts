import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../../utils/consts";
import APIError from "../../errors/api-error";
import DuplicateError from "../../errors/duplicate-error";
import { errorHandler } from "../error-handler";

describe("errorHandler middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  test("should respond with the custom error's status code and message", () => {
    const error = new APIError("Test error", StatusCode.BadRequest);

    errorHandler(error, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(StatusCode.BadRequest);
    expect(res.json).toHaveBeenCalledWith({
      errors: [{ message: "Test error" }],
    });
  });

  test("should use 409 for a DuplicateError", () => {
    const error = new DuplicateError("Email already exists");

    errorHandler(error, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(StatusCode.Conflict);
  });

  test("should respond with 500 and the message for a generic error", () => {
    const error = new Error("Generic error");

    errorHandler(error, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(StatusCode.InternalServerError);
    expect(res.json).toHaveBeenCalledWith({ message: "Generic error" });
  });

  test("should fall back to a default message when the error has none", () => {
    errorHandler(new Error(), req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(StatusCode.InternalServerError);
    expect(res.json).toHaveBeenCalledWith({
      message: "An unexpected error occurred",
    });
  });
});
