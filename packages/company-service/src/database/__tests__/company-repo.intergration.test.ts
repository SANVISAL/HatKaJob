import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import CompanyRepository from "../repository/company.repository";
import { CompanyProfile } from "../model/company.model";
import DuplicateError from "../error/duplicate-error";
import APIError from "../error/api-error";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  // The unique index on contactemail has to exist before the duplicate tests
  await CompanyProfile.init();
}, 120000);

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer?.stop();
});

afterEach(async () => {
  await CompanyProfile.deleteMany({});
});

describe("Company repository integration test", () => {
  let companyRepo: CompanyRepository;
  const MOCK_DATA = {
    companyname: "name_test",
    contactemail: "test@gmail.com",
  };

  beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  beforeEach(() => {
    companyRepo = new CompanyRepository();
  });

  describe("create", () => {
    test("should add a new company profile to the database", async () => {
      const newCompany = await companyRepo.create(MOCK_DATA);

      expect(newCompany.companyname).toEqual(MOCK_DATA.companyname);
      expect(newCompany.contactemail).toEqual(MOCK_DATA.contactemail);

      const found = await companyRepo.findById({
        id: newCompany._id.toString(),
      });
      expect(found?.companyname).toEqual(MOCK_DATA.companyname);
    });

    test("should throw DuplicateError if the email has been used", async () => {
      await companyRepo.create(MOCK_DATA);

      await expect(companyRepo.create(MOCK_DATA)).rejects.toThrow(
        DuplicateError
      );
    });

    test("should treat emails that differ only in case as duplicates", async () => {
      await companyRepo.create(MOCK_DATA);

      await expect(
        companyRepo.create({ ...MOCK_DATA, contactemail: "TEST@gmail.com" })
      ).rejects.toThrow(DuplicateError);
    });
  });

  describe("findByAuthID", () => {
    test("should find the company that belongs to an auth user", async () => {
      await companyRepo.create({ ...MOCK_DATA, userId: "auth-1" } as any);

      const found = await companyRepo.findByAuthID({ userId: "auth-1" });

      expect(found?.contactemail).toEqual(MOCK_DATA.contactemail);
    });

    test("should return null when no company belongs to the user", async () => {
      await expect(
        companyRepo.findByAuthID({ userId: "nobody" })
      ).resolves.toBeNull();
    });
  });

  describe("Update", () => {
    test("should update an existing company", async () => {
      const newCompany = await companyRepo.create(MOCK_DATA);

      const updated = await companyRepo.Update({
        id: newCompany._id.toString(),
        update: { companyname: "updated_name", location: "Phnom Penh" },
      });

      expect(updated.companyname).toEqual("updated_name");
      expect(updated.location).toEqual("Phnom Penh");
      expect(updated.contactemail).toEqual(MOCK_DATA.contactemail);
    });

    test("should throw a 404 APIError for an unknown company", async () => {
      const error = await companyRepo
        .Update({
          id: new mongoose.Types.ObjectId().toString(),
          update: { companyname: "x" },
        })
        .catch((e) => e);

      expect(error).toBeInstanceOf(APIError);
      expect(error.getStatusCode()).toBe(404);
    });
  });

  describe("delete", () => {
    test("should remove the company", async () => {
      const newCompany = await companyRepo.create(MOCK_DATA);
      const id = newCompany._id.toString();

      await companyRepo.delete({ id });

      await expect(companyRepo.findById({ id })).resolves.toBeNull();
    });
  });
});
