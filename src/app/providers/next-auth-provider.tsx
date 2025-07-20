"use client";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { useEffect } from "react";

export function NextAuthProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
