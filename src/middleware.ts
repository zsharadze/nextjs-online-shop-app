import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export default async function middleware(req: NextRequest) {
  const session: any = await auth();
  const path = req.nextUrl.pathname;

  const protectedNonAdminRoutes = ["/myorders"];

  if (path.startsWith("/_next")) {
    return NextResponse.next();
  }

  if (
    ((!session?.user || session?.user.role != "Admin") && path == "/admin") ||
    (!session?.user && protectedNonAdminRoutes.includes(path))
  ) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}
