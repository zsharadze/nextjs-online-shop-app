import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { validateEmail } from "@/app/helpers/emailvalidator";
import {dbConnect} from "@/app/data/connectMongo";
import { createUser, findUserByEmail } from "@/app/services/auth.service";

export const POST = async (request: any) => {
  const { email, password, registerAsAdmin } = await request.json();
  if (!validateEmail(email)) {
    return new NextResponse("Email is invalid", {
      status: 400,
    });
  }

  await dbConnect();

  let userExisting = await findUserByEmail(email);
  if (userExisting)
    return new NextResponse("User already registered.", {
      status: 400,
    });

  // Encrypt the password
  const hashedPassword = await bcrypt.hash(password, 5);
  // Form a DB payload
  const newUser = {
    password: hashedPassword,
    email,
    role: registerAsAdmin ? "Admin" : "User",
  };

  // Insert user in DB
  try {
    await createUser(newUser);
  } catch (error: any) {
    return new NextResponse(error.mesage, {
      status: 500,
    });
  }

  return new NextResponse("User has been created", {
    status: 201,
  });
};
