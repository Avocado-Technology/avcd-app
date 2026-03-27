import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const authSecret =
  process.env.AUTH_SECRET?.trim() || process.env.NEXTAUTH_SECRET?.trim();

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  secret: authSecret,
  providers: [
    Google({
      clientId:
        process.env.GOOGLE_CLIENT_ID?.trim() ||
        process.env.AUTH_GOOGLE_ID?.trim(),
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET?.trim() ||
        process.env.AUTH_GOOGLE_SECRET?.trim(),
      // Always show Google’s account picker so users can switch accounts after sign-out.
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
