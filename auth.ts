import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

import { authDebug, dbgLen, isAuthDebugEnabled } from "@/lib/auth-debug";
import { exchangeGoogleIdTokenForAvcdAccess } from "@/lib/server/exchange-google-for-avcd";

const authSecret =
  process.env.AUTH_SECRET?.trim() || process.env.NEXTAUTH_SECRET?.trim();

if (isAuthDebugEnabled()) {
  console.warn(
    "[avcd:auth-debug] auth.ts module load: NextAuth wiring (see jwt/session callbacks on sign-in)",
  );
  authDebug("NextAuth init", {
    hasAuthSecret: Boolean(authSecret && authSecret.length > 0),
    hasGoogleClientId: Boolean(
      process.env.GOOGLE_CLIENT_ID?.trim() || process.env.AUTH_GOOGLE_ID?.trim(),
    ),
    hasGoogleClientSecret: Boolean(
      process.env.GOOGLE_CLIENT_SECRET?.trim() ||
        process.env.AUTH_GOOGLE_SECRET?.trim(),
    ),
    authUrl: process.env.AUTH_URL?.trim() || process.env.NEXTAUTH_URL?.trim() || "(unset)",
    nodeEnv: process.env.NODE_ENV,
  });
}

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
    async jwt({ token, account, trigger }) {
      const idTok = account?.id_token;
      const idOk = typeof idTok === "string" && idTok.length > 0;
      if (idOk) {
        token.googleIdToken = idTok;
        const avcd = await exchangeGoogleIdTokenForAvcdAccess(idTok);
        if (avcd) {
          token.avcdAccessJwt = avcd;
          delete token.googleIdToken;
          authDebug(
            "jwt callback: stored avcdAccessJwt; dropped googleIdToken to keep session cookie small",
            { avcdAccessJwtChars: avcd.length },
          );
        } else {
          authDebug(
            "jwt callback: issuer exchange failed or AVCD_AUTH_URL unset; keeping googleIdToken (cookie may exceed browser limits)",
            { googleIdTokenChars: idTok.length },
          );
        }
      }
      authDebug("jwt callback", {
        trigger: trigger ?? "(none)",
        accountPresent: Boolean(account),
        accountIdTokenChars: dbgLen(
          typeof idTok === "string" ? idTok : undefined,
        ),
        storedGoogleIdTokenChars: dbgLen(token.googleIdToken),
        storedAvcdAccessJwtChars: dbgLen(token.avcdAccessJwt),
        tokenSub: token.sub ?? "(none)",
      });
      return token;
    },
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      authDebug("session callback", {
        userId: session.user?.id ?? token.sub ?? "(none)",
        email: session.user?.email ? "(set)" : "(none)",
        jwtHasGoogleIdToken: dbgLen(token.googleIdToken) > 0,
        googleIdTokenChars: dbgLen(token.googleIdToken),
        jwtHasAvcdAccessJwt: dbgLen(token.avcdAccessJwt) > 0,
        avcdAccessJwtChars: dbgLen(token.avcdAccessJwt),
      });
      return session;
    },
  },
});
