import { auth } from "@/auth";
import mongoose, { Schema } from "mongoose";
import { checkUserRoleAndExist } from "../services/permissions.service";
//make db connection singleton
declare global {
  var mongoose: any;
}
declare global {
  var loading: boolean;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  if (cached.conn) {
    console.log("Cached mongodb is called!");
    return cached.conn;
  }

  if (!cached.promise) {
    mongoose.set("strictQuery", true);
    cached.promise = await mongoose.connect(
      String(process.env.MONGO_DB_CONNECTION_STRING)
    );
    console.log("connected to mongoDB!");
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export async function dbConnectWithCheckUserPermissionAdmin() {
  const cachedConn = await dbConnect();
  const session: any = await auth();
  if (
    !session?.user ||
    session?.user?.role != "Admin" ||
    !(await checkUserRoleAndExist(session.user.email, ["Admin"]))
  ) {
    throw new Error("admin user is not authenticated");
  }
  return cachedConn;
}

export async function dbConnectWithCheckUserPermission() {
  const cachedConn = await dbConnect();
  const session: any = await auth();
  if (
    !session?.user ||
    !(await checkUserRoleAndExist(session.user.email, ["User", "Admin"]))
  ) {
    throw new Error("admin user is not authenticated");
  }
  return cachedConn;
}
