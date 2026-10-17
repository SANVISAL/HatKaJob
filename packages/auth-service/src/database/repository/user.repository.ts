// import { string } from "zod";
import APIError from "../../errors/api-error";
import DubplicateError from "../../errors/duplicate-error";
import { UserSignUpResult } from "../../service/@types/user.service.type";
import { StatusCode } from "../../utils/consts";
import authentication from "../model/user.repository";
import {
  UserCreateRepository,
  UserUpdateRepository,
} from "./@types/user.repository.type";

class UserRepository {
  async CreateUser(
    UserDetail: UserCreateRepository
  ): Promise<UserSignUpResult> {
    try {
      const existingUser = await this.FindUser({ email: UserDetail.email });
      if (existingUser) {
        throw new APIError(
          "This email is already in use",
          StatusCode.BadRequest
        );
      }
      const newUser = new authentication(UserDetail);
      const userResult = await newUser.save();
      return userResult as UserSignUpResult;
    } catch (error) {
      if (error instanceof DubplicateError) {
        throw error;
      }
      throw new APIError("Unable to Create User in Database");
    }
  }

  async FindUser({ email }: { email: string }) {
    try {
      const existingUser = await authentication.findOne({ email: email });
      return existingUser;
    } catch (error) {
      console.log(error);
    }
  }

  async FindUserById({ id }: { id: string }) {
    try {
      const existedUser = await authentication.findById(id);
      return existedUser;
    } catch (error) {
      console.log("Unable to Fine user in database");
    }
  }
  
  // update user
  async UpdateUserById({
    id,
    update,
  }: {
    id: string;
    update: UserUpdateRepository;
  }) {
    try {
      const isExist = await this.FindUserById({ id });
      if (!isExist) {
        return "User not Exist";
      }
      const newUserUpdate = await authentication.findByIdAndUpdate(id, update, {
        new: true,
      });
      return newUserUpdate;
    } catch (error) {}
  }
}

export default UserRepository;
