import CompanyRepository from "../repository/company.repository";
import { CompanyProfile } from "../model/company.model";
import DuplicateError from "../error/duplicate-error";

jest.mock("../model/company.model", () => {
  const CompanyProfile: any = jest.fn().mockImplementation((data) => ({
    ...data,
    save: jest.fn().mockResolvedValue({ _id: "1", ...data }),
  }));
  CompanyProfile.findOne = jest.fn();
  return { CompanyProfile };
});

describe("CompanyRepository (unit)", () => {
  let repo: CompanyRepository;

  beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    repo = new CompanyRepository();
  });

  test("findByEmail should query the lowercased contactemail field", async () => {
    (CompanyProfile.findOne as jest.Mock).mockResolvedValue(null);

    await repo.findByEmail({ contactEmail: " HR@Acme.com " });

    expect(CompanyProfile.findOne).toHaveBeenCalledWith({
      contactemail: "hr@acme.com",
    });
  });

  test("create should throw DuplicateError when the email is already used", async () => {
    (CompanyProfile.findOne as jest.Mock).mockResolvedValue({ _id: "existing" });

    await expect(
      repo.create({ companyname: "Acme", contactemail: "hr@acme.com" })
    ).rejects.toBeInstanceOf(DuplicateError);
  });

  test("create should save a company with a new email", async () => {
    (CompanyProfile.findOne as jest.Mock).mockResolvedValue(null);

    await expect(
      repo.create({ companyname: "Acme", contactemail: "hr@acme.com" })
    ).resolves.toMatchObject({ _id: "1", companyname: "Acme" });
  });
});
