import PostService from "../post-service";
import APIError from "../../database/error/api-error";
import { Post } from "../../database/model/post.model";

const mockPostRepo = {
  Create: jest.fn(),
  GetAll: jest.fn(),
  FindById: jest.fn(),
  FindByCidAndJobId: jest.fn(),
  FindByCompanyId: jest.fn(),
  Update: jest.fn(),
  Delete: jest.fn(),
};

jest.mock("../../database/repository/post.repository", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => mockPostRepo),
}));
jest.mock("../../database/model/post.model", () => ({
  Post: { find: jest.fn() },
}));
jest.mock("../../util/logger", () => ({
  logger: { error: jest.fn(), info: jest.fn() },
}));

describe("PostService", () => {
  let service: PostService;

  beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    service = new PostService();
  });

  test("Create should save the post through the repository", async () => {
    const post = { title: "Frontend intern" } as any;
    mockPostRepo.Create.mockResolvedValue({ _id: "1", ...post });

    await expect(service.Create(post)).resolves.toEqual({ _id: "1", ...post });
    expect(mockPostRepo.Create).toHaveBeenCalledWith(post);
  });

  test("Create should let repository errors (e.g. validation) through unchanged", async () => {
    const validationError = new APIError("title is required", 400);
    mockPostRepo.Create.mockRejectedValue(validationError);

    await expect(service.Create({} as any)).rejects.toBe(validationError);
  });

  test("GetAllPost should return every post", async () => {
    mockPostRepo.GetAll.mockResolvedValue([{ _id: "1" }, { _id: "2" }]);

    await expect(service.GetAllPost()).resolves.toHaveLength(2);
  });

  test("GetAllPost should wrap repository failures", async () => {
    mockPostRepo.GetAll.mockRejectedValue(new Error("db down"));

    await expect(service.GetAllPost()).rejects.toThrow(
      "Unable to retrieve posts"
    );
  });

  test.each([
    ["FindById", () => service.FindById({ id: "1" }), "FindById"],
    [
      "FindByCidAndJobId",
      () => service.FindByCidAndJobId("c1", "j1"),
      "FindByCidAndJobId",
    ],
    ["FindByCompanyId", () => service.FindByCompanyId("c1"), "FindByCompanyId"],
    [
      "UpdatePost",
      () => service.UpdatePost({ id: "1", update: {} as any }),
      "Update",
    ],
    ["DeletePost", () => service.DeletePost("1"), "Delete"],
  ] as const)(
    "%s should turn repository failures into an APIError",
    async (_name, call, repoMethod) => {
      mockPostRepo[repoMethod].mockRejectedValue(new Error("db down"));

      await expect(call()).rejects.toBeInstanceOf(APIError);
    }
  );

  test("FindByCidAndJobId should look the job up by company and job id", async () => {
    mockPostRepo.FindByCidAndJobId.mockResolvedValue({ _id: "j1" });

    await expect(service.FindByCidAndJobId("c1", "j1")).resolves.toEqual({
      _id: "j1",
    });
    expect(mockPostRepo.FindByCidAndJobId).toHaveBeenCalledWith("c1", "j1");
  });

  test("UpdatePost should pass the id and update to the repository", async () => {
    const update = { title: "Backend intern" } as any;
    mockPostRepo.Update.mockResolvedValue({ _id: "1", ...update });

    await service.UpdatePost({ id: "1", update });

    expect(mockPostRepo.Update).toHaveBeenCalledWith({ id: "1", update });
  });

  test("getPostsByCompanyId should query posts by companyId", async () => {
    const lean = jest.fn().mockResolvedValue([{ _id: "1" }]);
    (Post.find as jest.Mock).mockReturnValue({ lean });

    await expect(service.getPostsByCompanyId("c1")).resolves.toEqual([
      { _id: "1" },
    ]);
    expect(Post.find).toHaveBeenCalledWith({ companyId: "c1" });
  });
});
