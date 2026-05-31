"use client";

export function SessionProvider({
  children,
}: {
  children: React.ReactNode;
  user?: {
    name?: string | null;
    email?: string | null;
    picture?: string | null;
  };
}) {
  return <>{children}</>;
}
