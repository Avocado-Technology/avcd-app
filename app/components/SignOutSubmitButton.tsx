"use client";

import type { CSSProperties } from "react";
import { useFormStatus } from "react-dom";

type Props = {
  label?: string;
  pendingLabel?: string;
  style?: CSSProperties;
};

/**
 * Submit control for forms that call a server action; pairs with useFormStatus (Next.js / React 19).
 */
export function SignOutSubmitButton({
  label = "Sign out",
  pendingLabel = "Signing out…",
  style,
}: Props) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      style={style}
    >
      {pending ? pendingLabel : label}
    </button>
  );
}
