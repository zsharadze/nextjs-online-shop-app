"use server";
import { signIn, signOut } from "@/auth";

export async function doLogout() {
  await signOut({ redirectTo: "/" });
}

export async function doCredentialLogin(loginData: any) {
  try {
    const response = await signIn("credentials", {
      email: loginData.email,
      password: loginData.password,
      redirect: false,
    });

    return response;
  } catch (error: any) {
    switch (error.type) {
      case "CredentialsSignin":
        return { error: "Your email and/or password are incorrect." };
      default:
        return { error: "Something went wrong!" };
    }
  }
}
