export interface CreateUserInput {
  fullname: string;
  email: string;
  username: string;
  password: string;
  gender?: string;
}

export interface SetupInput {
  gender?: string;
  birthday?: string;
  country?: string;
  occupation?: string;
  currency?: string;
  spend_limit?: number;
}

export interface LoginInput {
  username: string;
  password: string;
}

export interface UpdateUserInput {
  id: string;
  fullname?: string;
  email?: string;
  username?: string;
  password?: string;
  gender?: string;
  birthday?: string;
  country?: string;
  profile_photo?: string;
  occupation?: string;
  description?: string;
  currency?: string;
}

export interface DeleteUserInput {
  id: string;
}

export interface GetUserInput {
  id?: string;
  email?: string;
  username?: string;
}

export interface GetAllUsersInput {
  page?: number;
  limit?: number;
}

export interface UserResponse {
  _id: string;
  fullname: string;
  username: string;
  gender: string;
  completedSetup: boolean;
  verified: boolean;
  status: "active" | "suspended" | "deleted";
  birthday?: string;
  country?: string;
  profile_photo?: string;
  occupation?: string;
  description?: string;
  currency?: string;
}

export interface UserLoginResponse {
  user: UserResponse;
  token: string;
}

export interface UserDeleteResponse {
  message: string;
}

export interface UserUpdateResponse {
  user: UserResponse;
}

export interface UserGetAllResponse {
  users: UserResponse[];
  total: number;
  page: number;
  limit: number;
}