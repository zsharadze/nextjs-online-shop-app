"use server";
import { User } from "../data/models/user-model";

export const throwExceptionIfNotAuthenticated = async (session: any) => {
  if (
    !session?.user ||
    !(await checkUserRoleAndExist(session.user.email, ["User", "Admin"]))
  ) {
    throw new Error("user is not authenticated or does not have permission");
  }
};

//checks if user exists. needed when user is deleted from db not to allow user restricted actions.
export const checkUserRoleAndExist = async (
  email: string,
  allowedRoles: string[]
) => {
  const user = await User.findOne({
    email: email,
  });
  if (user && allowedRoles.indexOf(user.role) > -1) {
    console.log("user exists and contains role");
    return true;
  } else {
    console.log("user not exists or not contains role");
    return false;
  }
};
