import { UserService } from "../userService/userProfileService";
import APIError from "../../error/api-error";
import DuplitcateError from "../../error/duplitcate-error";

const mockUserRepo = {
  createUser: jest.fn(),
  getAll: jest.fn(),
  findById: jest.fn(),
  findByAuthID: jest.fn(),
  update: jest.fn(),
  deleteUser: jest.fn(),
  removeFavoriteJob: jest.fn(),
};

jest.mock(
  "../../database/repository/userRepository/userProfileRepo",
  () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(() => mockUserRepo),
  })
);
jest.mock("../../utils/logger", () => ({
  logger: { error: jest.fn(), info: jest.fn() },
}));

describe("UserService (profile)", () => {
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

  describe("createUser", () => {
    const profile = {
      authid: "auth-1",
      fullname: "Visal",
      email: "visal@test.com",
    } as any;

    test("should create the profile through the repository", async () => {
      mockUserRepo.createUser.mockResolvedValue({ _id: "1", ...profile });

      await expect(service.createUser(profile)).resolves.toEqual({
        _id: "1",
        ...profile,
      });
    });

    test("should fail when the profile already exists", async () => {
      mockUserRepo.createUser.mockRejectedValue(new DuplitcateError("dup"));

      await expect(service.createUser(profile)).rejects.toThrow(
        "Unable to create user"
      );
    });
  });

  test("getByAuthId should look the profile up by the auth user id", async () => {
    mockUserRepo.findByAuthID.mockResolvedValue({ _id: "1" });

    await expect(service.getByAuthId({ userId: "auth-1" })).resolves.toEqual({
      _id: "1",
    });
    expect(mockUserRepo.findByAuthID).toHaveBeenCalledWith({
      userId: "auth-1",
    });
  });

  test("updateUser should pass the id and update to the repository", async () => {
    const update = { fullname: "New Name" } as any;
    mockUserRepo.update.mockResolvedValue({ _id: "1", ...update });

    await service.updateUser({ id: "1", update });

    expect(mockUserRepo.update).toHaveBeenCalledWith({ id: "1", update });
  });

  test.each([
    ["getAll", () => service.getAll(), "getAll"],
    ["getById", () => service.getById({ id: "1" }), "findById"],
    [
      "getByAuthId",
      () => service.getByAuthId({ userId: "auth-1" }),
      "findByAuthID",
    ],
    [
      "updateUser",
      () => service.updateUser({ id: "1", update: {} as any }),
      "update",
    ],
    ["delete", () => service.delete({ id: "1" }), "deleteUser"],
    ["removeJobPost", () => service.removeJobPost("1", "job-1"), "removeFavoriteJob"],
  ] as const)(
    "%s should turn repository failures into an APIError",
    async (_name, call, repoMethod) => {
      mockUserRepo[repoMethod].mockRejectedValue(new Error("db down"));

      await expect(call()).rejects.toBeInstanceOf(APIError);
    }
  );

  describe("addFavoriteJob", () => {
    test("should add a new job to the user's favorites and save", async () => {
      const user = { favorite: ["job-1"], save: jest.fn() };
      mockUserRepo.findById.mockResolvedValue(user);

      const result = await service.addFavoriteJob("1", "job-2");

      expect(user.save).toHaveBeenCalled();
      expect(result).toEqual({ message: "Favorite", data: ["job-1", "job-2"] });
    });

    test("should start a favorites list when the user has none", async () => {
      const user: { favorite?: string[]; save: jest.Mock } = { save: jest.fn() };
      mockUserRepo.findById.mockResolvedValue(user);

      await service.addFavoriteJob("1", "job-1");

      expect(user.favorite).toEqual(["job-1"]);
    });

    test("should not add the same job twice", async () => {
      const user = { favorite: ["job-1"], save: jest.fn() };
      mockUserRepo.findById.mockResolvedValue(user);

      const result = await service.addFavoriteJob("1", "job-1");

      expect(user.save).not.toHaveBeenCalled();
      expect(result.data).toEqual(["job-1"]);
    });

    test("should fail with an APIError when the user does not exist", async () => {
      mockUserRepo.findById.mockResolvedValue(null);

      await expect(service.addFavoriteJob("1", "job-1")).rejects.toBeInstanceOf(
        APIError
      );
    });
  });
});
