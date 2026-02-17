import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import "server-only";

export const AuthGuard = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthinticaed");
  }

  return session;
};
