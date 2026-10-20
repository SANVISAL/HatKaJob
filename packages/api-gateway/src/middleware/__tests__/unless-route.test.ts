import { Request, Response } from "express";
import unless from "../unless-route";

describe("unless middleware", () => {
  let res: Partial<Response>;
  let next: jest.Mock;
  let protect: jest.Mock;

  const request = (path: string, method = "GET") =>
    ({ path, method }) as Request;

  beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    res = {};
    next = jest.fn();
    protect = jest.fn();
  });

  test("should skip the middleware for a matching string path prefix", () => {
    unless([{ path: "/v1/auth" }], protect)(
      request("/v1/auth/login"),
      res as Response,
      next
    );

    expect(next).toHaveBeenCalled();
    expect(protect).not.toHaveBeenCalled();
  });

  test("should skip the middleware for a matching regex path", () => {
    unless([{ path: /^\/v1\/jobs\/[a-z0-9]+$/ }], protect)(
      request("/v1/jobs/abc123"),
      res as Response,
      next
    );

    expect(protect).not.toHaveBeenCalled();
  });

  test("should only skip when the method matches too", () => {
    const middleware = unless([{ path: "/v1/jobs", method: "GET" }], protect);

    middleware(request("/v1/jobs", "GET"), res as Response, next);
    expect(protect).not.toHaveBeenCalled();

    middleware(request("/v1/jobs", "POST"), res as Response, next);
    expect(protect).toHaveBeenCalledTimes(1);
  });

  test("should run the middleware for a route that matches nothing", () => {
    const req = request("/v1/users/me");

    unless([{ path: "/v1/auth" }], protect)(req, res as Response, next);

    expect(protect).toHaveBeenCalledWith(req, res, next);
    expect(next).not.toHaveBeenCalled();
  });
});
