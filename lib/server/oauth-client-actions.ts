"use server";

import { getApiAccessJwt } from "./get-api-access-jwt";
import { getAvcdAuthBaseUrl } from "@/lib/avcd-auth";

export async function generateOAuthClientAction(clientName: string) {
  const tokenResult = await getApiAccessJwt();
  if (!tokenResult.ok) {
    return { ok: false, error: "Not authenticated" };
  }

  const authBase = getAvcdAuthBaseUrl();
  
  try {
    const response = await fetch(`${authBase}/oauth/clients`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${tokenResult.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ client_name: clientName }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { ok: false, error: error.detail || "Failed to create client" };
    }

    const client = await response.json();
    return { ok: true, client };
  } catch {
    return { ok: false, error: "Network error" };
  }
}

export async function getOAuthClientAction() {
  const tokenResult = await getApiAccessJwt();
  if (!tokenResult.ok) {
    return { ok: false, error: "Not authenticated" };
  }

  const authBase = getAvcdAuthBaseUrl();
  
  try {
    const response = await fetch(`${authBase}/oauth/clients`, {
      headers: {
        "Authorization": `Bearer ${tokenResult.token}`,
      },
    });

    if (!response.ok) {
      return { ok: false, error: "Failed to fetch client" };
    }

    const data = await response.json();
    return { ok: true, client: data.client };
  } catch {
    return { ok: false, error: "Network error" };
  }
}
