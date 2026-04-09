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
    auth_url = (os.environ.get("E_AURL") or "").strip() or f"https://{ph}"
    avcd = (os.environ.get("E_AVCD") or "").strip() or "http://auth:8000"
    lines = [
        "AUTH_SECRET=" + esc(os.environ["E_AS"]),
        "GOOGLE_CLIENT_ID=" + esc(os.environ["E_GID"]),
        "GOOGLE_CLIENT_SECRET=" + esc(os.environ["E_GSEC"]),
        "AUTH_URL=" + esc(auth_url),
        "AVCD_AUTH_URL=" + esc(avcd),
        "AUTH_DEBUG=1",
    ]
    print("\n".join(lines) + "\n", end="")


if __name__ == "__main__":
    main()
