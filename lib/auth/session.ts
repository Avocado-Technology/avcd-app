import { auth } from "./keycloak";

export async function getSession() {
  return auth();
}

export async function getAccessToken(): Promise<{ token: string } | null> {
  const session = await auth();
  const token = session?.accessToken?.trim();
  if (!token) {
    return null;
  }
  return { token };
}
