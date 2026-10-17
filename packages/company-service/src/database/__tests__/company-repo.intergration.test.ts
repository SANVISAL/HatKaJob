// import { MongoMemoryServer } from "mongodb-memory-server";
// import mongoose from "mongoose";
// import CompanyRepo from "../repository/company.repository";
// import DuplicateError from "../error/duplicate-error";

// let mongoServer: MongoMemoryServer;

// beforeAll(async () => {
//   mongoServer = await MongoMemoryServer.create();
//   const mongoURL = mongoServer.getUri();
//   await mongoose.connect(mongoURL);
// }, 1000000);

// afterAll(async () => {
//   await mongoose.disconnect();
//   await mongoServer.stop();
// });

// describe("Company repository integration test", () => {
//   let companyrepo: CompanyRepo;
//   beforeEach(() => {
//     companyrepo = new CompanyRepo();
//   });

//   describe("Create company profile", () => {
//     test("should add new company profile to database", async () => {
//       const MOCK_DATA = {
//         companyName: "name_test",
//         contactEmail: "test@gmail.com",
//       };

//       const newcompany = await companyrepo.Create(MOCK_DATA);
//       expect(newcompany).toBeDefined();
//       expect(newcompany.companyName).toEqual(MOCK_DATA.companyName);
//       expect(newcompany.contactEmail).toEqual(MOCK_DATA.contactEmail);

//       // Check if company profile exists in database
//       const foundcompany = await companyrepo.FindById({
//         id: newcompany._id.toString(),
//       });
//       expect(foundcompany).toBeDefined();
//       expect(foundcompany?.companyName).toEqual(MOCK_DATA.companyName);
//     });

//     test("should throw DuplicateError if email has been used", async () => {
//       const MOCK_DATA = {
//         companyName: "name_test",
//         contactEmail: "test@gmail.com",
//       };

//       await companyrepo.Create(MOCK_DATA);
//       await expect(companyrepo.Create(MOCK_DATA)).rejects.toThrow(
//         DuplicateError
//       );
//     });

//     test("should update existing company", async () => {
//       const MOCK_DATA = {
//         companyName: "name_test",
//         contactEmail: "test@gmail.com",
//       };

//       const newcompany = await companyrepo.Create(MOCK_DATA);
//       const UPDATE_DATA = {
//         companyName: "updated_name",
//         contactEmail: "test@gmail.com",
//       };

//       await expect(
//         companyrepo.Update({
//           id: newcompany._id.toString(),
//           update: UPDATE_DATA,
//         })
//       ).resolves.not.toThrow();

//       const updatedata = await companyrepo.FindById({
//         id: newcompany._id.toString(),
//       });
//       expect(updatedata).toBeDefined();
//       expect(updatedata?.companyName).toEqual(UPDATE_DATA.companyName);
//       expect(updatedata?.contactEmail).toEqual(UPDATE_DATA.contactEmail);
//     });
//   });
// });
