"use server";
import {
  dbConnect,
  dbConnectWithCheckUserPermission,
} from "@/app/data/connectMongo";
import { User } from "@/app/data/models/user-model";
import { ChangePasswordDTO } from "../dtos/changePasswordDTO";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";

export const createUser = async (newUser: any) => {
  await dbConnect();
  await User.create(newUser);
};

export const findUserByEmail = async (email: string) => {
  await dbConnect();

  const user = await User.findOne({
    email: email,
  });
  return user;
};

export const changeUserPassword = async (
  changePassword: ChangePasswordDTO
): Promise<[boolean, string]> => {
  await dbConnectWithCheckUserPermission();
  if (changePassword.newPassword !== changePassword.confirmPassword) {
    throw new Error("Confirm password does not match.");
  }
  const session: any = await auth();
  const user = await findUserByEmail(session.user.email);
  if (!user) throw new Error("User not found.");
  //check old password validity
  const isMatch = await bcrypt.compare(
    changePassword.oldPassword,
    user.password
  );
  if (!isMatch) {
    return [false, "Old password is incorrect."];
  } else {
    const hashedPassword = await bcrypt.hash(changePassword.newPassword, 5);
    await User.findOneAndUpdate(
      { email: session.user.email },
      {
        $set: {
          password: hashedPassword,
        },
      }
    );
    return [true, ""];
  }
};
