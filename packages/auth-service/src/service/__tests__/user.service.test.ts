import axios from "axios";
import UserService from "../user.service";
import DuplicateError from "../../errors/duplicate-error";
import APIError from "../../errors/api-error";
import { StatusCode } from "../../utils/consts";
import {
  ValidatePassword,
  generatePassword,
  generateSignature,
} from "../../utils/jwt";
import { publishDirectMessage } from "../../queues/auth.producer";

const mockUserRepo = {
  CreateUser: jest.fn(),
  FindUser: jest.fn(),
  FindUserById: jest.fn(),
  UpdateUserById: jest.fn(),
};
const mockAccountVerificationRepo = {
  FindVerificationTokenById: jest.fn(),
  FindVerificationToken: jest.fn(),
  DeleteVerificationToken: jest.fn(),
};

jest.mock("../../database/repository/user.repository", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => mockUserRepo),
}));
jest.mock("../../database/repository/account-verication-repository", () => ({
  AccountVerificationRepository: jest
    .fn()
    .mockImplementation(() => mockAccountVerificationRepo),
}));
jest.mock("../../utils/jwt", () => ({
  generatePassword: jest.fn(),
  ValidatePassword: jest.fn(),
  generateSignature: jest.fn(),
}));
jest.mock("../../queues/auth.producer", () => ({
  publishDirectMessage: jest.fn(),
}));
jest.mock("../../server", () => ({ authChannel: {} }));
jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

const expectAPIError = async (promise: Promise<unknown>, status: number) => {
  const error = await promise.catch((e) => e);
  expect(error).toBeInstanceOf(APIError);
  expect((error as APIError).getStatusCode()).toBe(status);
  return error as APIError;
};

describe("UserService", () => {
  let service: UserService;

  beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    service = new UserService();
  });

  describe("Create", () => {
    const signup = {
      username: "visal",
      email: "visal@test.com",
      password: "secret123",
      role: "seeker",
    } as any;

    test("should hash the password before saving the user", async () => {
      (generatePassword as jest.Mock).mockResolvedValue("hashed");
      mockUserRepo.CreateUser.mockResolvedValue({ _id: "1" });

      const result = await service.Create(signup);

      expect(mockUserRepo.CreateUser).toHaveBeenCalledWith({
        ...signup,
        password: "hashed",
      });
      expect(result).toEqual({ _id: "1" });
    });

    test("should save an OAuth user without a password unchanged", async () => {
      const oauthUser = { username: "visal", email: "visal@test.com" } as any;
      mockUserRepo.CreateUser.mockResolvedValue({ _id: "1" });

      await service.Create(oauthUser);

      expect(generatePassword).not.toHaveBeenCalled();
      expect(mockUserRepo.CreateUser).toHaveBeenCalledWith(oauthUser);
    });

    test("should resend the verification email for an unverified duplicate", async () => {
      mockUserRepo.CreateUser.mockRejectedValue(new DuplicateError("dup"));
      mockUserRepo.FindUser.mockResolvedValue({
        _id: "1",
        email: signup.email,
        isVerified: false,
      });
      mockAccountVerificationRepo.FindVerificationTokenById.mockResolvedValue({
        emailVerificationToken: "token-123",
      });

      const error = await expectAPIError(
        service.Create(signup),
        StatusCode.Conflict
      );

      expect(error.message).toMatch(/Verification email resent/);
      expect(publishDirectMessage).toHaveBeenCalledWith(
        {},
        "email-notification",
        "auth-email",
        JSON.stringify({
          reciverEmail: signup.email,
          verifyLink: "token-123",
          template: "verifyEmail",
        }),
        expect.any(String)
      );
    });

    test("should fail with 500 when an unverified duplicate has no token", async () => {
      mockUserRepo.CreateUser.mockRejectedValue(new DuplicateError("dup"));
      mockUserRepo.FindUser.mockResolvedValue({ _id: "1", isVerified: false });
      mockAccountVerificationRepo.FindVerificationTokenById.mockResolvedValue(
        null
      );

      await expectAPIError(
        service.Create(signup),
        StatusCode.InternalServerError
      );
      expect(publishDirectMessage).not.toHaveBeenCalled();
    });

    test("should ask a verified duplicate to log in", async () => {
      mockUserRepo.CreateUser.mockRejectedValue(new DuplicateError("dup"));
      mockUserRepo.FindUser.mockResolvedValue({ _id: "1", isVerified: true });

      const error = await expectAPIError(
        service.Create(signup),
        StatusCode.Conflict
      );

      expect(error.message).toMatch(/Please login/);
    });

    test("should rethrow errors that are not duplicates", async () => {
      const dbError = new Error("db down");
      mockUserRepo.CreateUser.mockRejectedValue(dbError);

      await expect(service.Create(signup)).rejects.toBe(dbError);
    });
  });

  describe("Login", () => {
    const credentials = { email: "visal@test.com", password: "secret123" };

    test("should fail with 404 when the user does not exist", async () => {
      mockUserRepo.FindUser.mockResolvedValue(null);

      await expectAPIError(service.Login(credentials), StatusCode.NotFound);
    });

    test("should fail with 400 when the password is wrong", async () => {
      mockUserRepo.FindUser.mockResolvedValue({ password: "hashed" });
      (ValidatePassword as jest.Mock).mockResolvedValue(false);

      await expectAPIError(service.Login(credentials), StatusCode.BadRequest);
    });

    test("should return the user and role when the password is correct", async () => {
      const user = { password: "hashed", role: "employer" };
      mockUserRepo.FindUser.mockResolvedValue(user);
      (ValidatePassword as jest.Mock).mockResolvedValue(true);

      await expect(service.Login(credentials)).resolves.toEqual({
        user,
        role: "employer",
      });
      expect(ValidatePassword).toHaveBeenCalledWith({
        enterPassword: "secret123",
        savedPassword: "hashed",
      });
    });
  });

  describe("VerifyEmailToken", () => {
    test("should fail with 400 for an unknown token", async () => {
      mockAccountVerificationRepo.FindVerificationToken.mockResolvedValue(null);

      await expectAPIError(
        service.VerifyEmailToken({ token: "bad" }),
        StatusCode.BadRequest
      );
    });

    test("should fail with 404 when the token's user is gone", async () => {
      mockAccountVerificationRepo.FindVerificationToken.mockResolvedValue({
        userId: "1",
      });
      mockUserRepo.FindUserById.mockResolvedValue(null);

      await expectAPIError(
        service.VerifyEmailToken({ token: "good" }),
        StatusCode.NotFound
      );
    });

    test("should verify a seeker, create their profile and return a JWT", async () => {
      const user = {
        _id: "1",
        id: "1",
        role: "seeker",
        username: "visal",
        email: "visal@test.com",
        isVerified: false,
        save: jest.fn(),
      };
      mockAccountVerificationRepo.FindVerificationToken.mockResolvedValue({
        userId: "1",
      });
      mockUserRepo.FindUserById.mockResolvedValue(user);
      (generateSignature as jest.Mock).mockResolvedValue("jwt-token");
      mockedAxios.post.mockResolvedValue({ data: { _id: "profile-1" } });

      const result = await service.VerifyEmailToken({ token: "good" });

      expect(user.isVerified).toBe(true);
      expect(user.save).toHaveBeenCalled();
      expect(
        mockAccountVerificationRepo.DeleteVerificationToken
      ).toHaveBeenCalledWith({ token: "good" });
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "http://profile-service:4003/v1/users",
        { authid: "1", fullname: "visal", email: "visal@test.com" },
        expect.any(Object)
      );
      expect(result).toMatchObject({
        token: "jwt-token",
        status: "success",
        id: "profile-1",
      });
    });
  });

  describe("SentRequestBaseOnRole", () => {
    test("should create a company profile for an employer", async () => {
      mockedAxios.post.mockResolvedValue({ data: { _id: "company-1" } });

      const result = await service.SentRequestBaseOnRole({
        _id: "1",
        role: "employer",
        username: "Acme",
        email: "hr@acme.com",
      });

      expect(mockedAxios.post).toHaveBeenCalledWith(
        "http://company-service:4004/v1/companies",
        { userId: "1", companyname: "Acme", contactemail: "hr@acme.com" },
        expect.any(Object)
      );
      expect(result).toEqual({ id: "company-1" });
    });

    test("should fail with 500 when the downstream service is unreachable", async () => {
      mockedAxios.post.mockRejectedValue(new Error("ECONNREFUSED"));

      await expectAPIError(
        service.SentRequestBaseOnRole({ _id: "1", role: "seeker" }),
        StatusCode.InternalServerError
      );
    });
  });

  describe("UpdateUser", () => {
    test("should fail with 404 when the user does not exist", async () => {
      mockUserRepo.FindUserById.mockResolvedValue(null);

      await expectAPIError(
        service.UpdateUser({ id: "1", update: {} }),
        StatusCode.NotFound
      );
      expect(mockUserRepo.UpdateUserById).not.toHaveBeenCalled();
    });

    test("should update an existing user", async () => {
      mockUserRepo.FindUserById.mockResolvedValue({ _id: "1" });
      mockUserRepo.UpdateUserById.mockResolvedValue({ _id: "1", username: "new" });

      await expect(
        service.UpdateUser({ id: "1", update: { username: "new" } })
      ).resolves.toEqual({ _id: "1", username: "new" });
    });
  });
});
