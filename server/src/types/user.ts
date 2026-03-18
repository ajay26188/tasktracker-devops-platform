import { Types } from "mongoose";

export enum Role {
  Admin = "admin",
  Member = "member",
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  organizationId: Types.ObjectId;
  role: Role;
  isVerified: boolean; 
}

export interface ReturnedIUser {
  _id?: Types.ObjectId;
  password?: string;
  __v?: number; // operand of 'delete' operator must be optional
  id?: string;
  name: string;
  email: string;
  organizationId: Types.ObjectId;
  role: Role;
  isVerified?: boolean; 
  createdAt?: Date;
  updatedAt?: Date;
}

// removing organizationId field which is of Mongo_DB type but asking for string
export type newUserData = Omit<IUser, "role" | "organizationId" | "isVerified"> & {
  organizationId: string;
};

export interface LoginData {
  email: string;
  password: string;
}

export interface updatePasswordData {
  oldPassword: string,
  newPassword: string
}

export interface updateRole {
  role: Role;
}

export interface emailVerification {
  email: string
}

export interface resetPassword {
  password: string;
  confirmPassword: string
}
