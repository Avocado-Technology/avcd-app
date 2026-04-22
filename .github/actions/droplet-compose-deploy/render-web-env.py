#!/usr/bin/env python3
"""Emit a docker-compose `.env` body for GitHub-managed web deploy (stdout). Reads E_* from os.environ."""
from __future__ import annotations

import os


def esc(s: str) -> str:
    if "\n" in s or "\r" in s:
        raise SystemExit("web .env: values must be single-line (no newlines in secrets)")
    if not s:
        return '""'
    safe = True
    for c in s:
        if c in ' "\\#\'\t':
            safe = False
            break
    if safe:
        return s
    return '"' + s.replace("\\", "\\\\").replace('"', '\\"') + '"'


def main() -> None:
    ph = os.environ["E_PH"]
    base_url = (os.environ.get("E_BASE_URL") or "").strip() or f"https://{ph}"

    # GraphQL API endpoint - use deployed API endpoint
    graphql_endpoint = f"https://{ph}/api/graphql"

    # MCP server public URL defaults to https://<host>/mcp if not overridden
    mcp_server_url = (os.environ.get("E_MCP_SERVER_URL") or "").strip() or f"https://{ph}/mcp"

    lines = [
        "# Auth0 Configuration",
        "AUTH0_SECRET=" + esc(os.environ["E_AUTH0_SECRET"]),
        "AUTH0_BASE_URL=" + esc(base_url),
        "AUTH0_ISSUER_BASE_URL=" + esc(os.environ["E_AUTH0_ISSUER"]),
        "AUTH0_CLIENT_ID=" + esc(os.environ["E_AUTH0_CLIENT_ID"]),
        "AUTH0_CLIENT_SECRET=" + esc(os.environ["E_AUTH0_CLIENT_SECRET"]),
        "AUTH0_AUDIENCE=" + esc(os.environ.get("E_AUTH0_AUDIENCE", "")),
        "AUTH0_SCOPE=" + esc(os.environ.get("E_AUTH0_SCOPE", "openid profile email offline_access")),
        "",
        "# GraphQL API Endpoint",
        "NEXT_PUBLIC_GRAPHQL_ENDPOINT=" + esc(graphql_endpoint),
        "",
        "# AI Chat",
        "OPENAI_API_KEY=" + esc(os.environ.get("E_OPENAI_API_KEY", "")),
        "CHAT_MODEL=" + esc(os.environ.get("E_CHAT_MODEL", "gpt-4o")),
        # Server-side URL the Next.js container uses to reach the MCP server.
        # Defaults empty so the chat handler skips MCP tools gracefully when unset.
        "AVCD_MCP_URL=" + esc(os.environ.get("E_AVCD_MCP_URL", "")),
        "",
        "# MCP public config (used by the /settings/mcp setup page)",
        "NEXT_PUBLIC_AUTH0_MCP_CLIENT_ID=" + esc(os.environ.get("E_MCP_CLIENT_ID", "")),
        "NEXT_PUBLIC_MCP_SERVER_URL=" + esc(mcp_server_url),
        "",
        "# Client UI (build-time in Next; passed as compose build arg — keep true for mobile shell)",
        "NEXT_PUBLIC_ENABLE_MOBILE_BOTTOM_NAV=" + esc(os.environ.get("E_ENABLE_MOBILE_BOTTOM_NAV", "true")),
        "",
        "# Public Host",
        "PUBLIC_HOST=" + esc(ph),
    ]
    print("\n".join(lines) + "\n", end="")


if __name__ == "__main__":
    main()
