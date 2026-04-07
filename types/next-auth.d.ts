import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & { id?: string };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    /** Large; removed after successful exchange for `avcdAccessJwt` to avoid 4KB cookie limits. */
    googleIdToken?: string;
    /** HS256 access JWT from auth issuer; use as Bearer token for the API. */
    avcdAccessJwt?: string;
  }
}
