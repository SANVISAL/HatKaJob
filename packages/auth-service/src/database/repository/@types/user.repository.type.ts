export interface UserCreateRepository {
  username: string;
  email: string;
  password?: string;
  role: string;
  googleId?: string;
}

export interface UserUpdateRepository {
  username?: string;
  password?: string;
  role?: string;
  googleId?: string;
}

export interface IUser {

  authId?: string;
  username?: string;
  email?: string;
  picture: string | null;
}