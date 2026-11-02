import { createServerClient } from "@insforge/sdk/ssr";
import { cookies } from "next/headers";
import { connection } from "next/server";

export async function createInsforgeServer() {
  await connection();

  return createServerClient({
    cookies: await cookies(),
  });
}
