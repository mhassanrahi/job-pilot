import "server-only";

import { cache } from "react";
import { createInsforgeServer } from "@/lib/insforge-server";

export const isAuthenticated = cache(async (): Promise<boolean> => {
  const insforge = await createInsforgeServer();
  const { data, error } = await insforge.auth.getCurrentUser();

  if (error) {
    console.error("[lib/auth:isAuthenticated] Session check failed", error);
    return false;
  }

  return Boolean(data.user);
});
