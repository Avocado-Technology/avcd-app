"use server";

import { getApiAccessJwt } from "@/lib/server/get-api-access-jwt";

/** Returns the AVCD access JWT from session or via auth issuer (`/google/token`). No main API calls. */
export async function getAvcdAccessTokenAction() {
  return getApiAccessJwt();
}
