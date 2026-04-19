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
        "# Public Host",
        "PUBLIC_HOST=" + esc(ph),
    ]
    print("\n".join(lines) + "\n", end="")


if __name__ == "__main__":
    main()
