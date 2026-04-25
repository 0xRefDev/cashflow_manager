import { UserResponse } from "@/types/user.types";

export type RegisterPayload = {
  fullname: string;
  username: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  username: string;
  password: string;
};

export type LoginResponse = {
  success: boolean;
  user: UserResponse;
};
