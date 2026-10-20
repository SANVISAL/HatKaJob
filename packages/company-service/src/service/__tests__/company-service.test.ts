import CompanyService from "../company-servive";
import APIError from "../../database/error/api-error";

const mockCompanyRepo = {
  create: jest.fn(),
  getAll: jest.fn(),
  findById: jest.fn(),
  findByAuthID: jest.fn(),
  delete: jest.fn(),
  Update: jest.fn(),
};

jest.mock("../../database/repository/company.repository", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => mockCompanyRepo),
}));

describe("CompanyService", () => {
  let service: CompanyService;

  beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CompanyService();
  });

  test("create should save the company through the repository", async () => {
    const company = { companyname: "Acme", contactemail: "hr@acme.com" };
    mockCompanyRepo.create.mockResolvedValue({ _id: "1", ...company });

    await expect(service.create(company)).resolves.toEqual({
      _id: "1",
      ...company,
    });
    expect(mockCompanyRepo.create).toHaveBeenCalledWith(company);
  });

  test("create should wrap repository failures", async () => {
    mockCompanyRepo.create.mockRejectedValue(new Error("db down"));

    await expect(
      service.create({ companyname: "Acme", contactemail: "hr@acme.com" })
    ).rejects.toThrow("Unable to create user from service");
  });

  test("getAll should return every company", async () => {
    mockCompanyRepo.getAll.mockResolvedValue([{ _id: "1" }]);

    await expect(service.getAll()).resolves.toEqual([{ _id: "1" }]);
  });

  test("findByAuthId should look the company up by the auth user id", async () => {
    mockCompanyRepo.findByAuthID.mockResolvedValue({ _id: "1" });

    await expect(service.findByAuthId({ userId: "auth-1" })).resolves.toEqual({
      _id: "1",
    });
    expect(mockCompanyRepo.findByAuthID).toHaveBeenCalledWith({
      userId: "auth-1",
    });
  });

  test("update should pass the id and update to the repository", async () => {
    const update = { location: "Phnom Penh" };
    mockCompanyRepo.Update.mockResolvedValue({ _id: "1", ...update });

    await service.update({ id: "1", update });

    expect(mockCompanyRepo.Update).toHaveBeenCalledWith({ id: "1", update });
  });

  test.each([
    ["findById", () => service.findById({ id: "1" }), "findById"],
    [
      "findByAuthId",
      () => service.findByAuthId({ userId: "auth-1" }),
      "findByAuthID",
    ],
    ["delete", () => service.delete({ id: "1" }), "delete"],
    ["update", () => service.update({ id: "1", update: {} }), "Update"],
  ] as const)(
    "%s should turn repository failures into an APIError",
    async (_name, call, repoMethod) => {
      mockCompanyRepo[repoMethod].mockRejectedValue(new Error("db down"));

      await expect(call()).rejects.toBeInstanceOf(APIError);
    }
  );
});
