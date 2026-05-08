import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

// In-memory OTP store (works for single-server; swap for Redis in prod)
const otpStore = new Map<string, { code: string; expires: number }>();

/** Generate a 6-digit OTP */
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const authOptions: NextAuthOptions = {
  providers: [
    // ─── Google OAuth ───
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),

    // ─── Email + OTP ───
    CredentialsProvider({
      id: "email-otp",
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        otp: { label: "Verification Code", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.otp) return null;

        const stored = otpStore.get(credentials.email);
        if (!stored) return null;
        if (Date.now() > stored.expires) {
          otpStore.delete(credentials.email);
          return null;
        }
        if (stored.code !== credentials.otp) return null;

        // OTP valid — clean up and return user
        otpStore.delete(credentials.email);
        const name = credentials.email.split("@")[0];
        return {
          id: credentials.email,
          email: credentials.email,
          name: name.charAt(0).toUpperCase() + name.slice(1),
          image: null,
        };
      },
    }),
  ],

  pages: {
    signIn: "/login",
    newUser: "/onboarding",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // After sign in, go to dashboard
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (url.startsWith(baseUrl)) return url;
      return `${baseUrl}/dashboard`;
    },
  },

  secret: process.env.NEXTAUTH_SECRET || "klyrn-dev-secret-change-in-production",
};

// ─── OTP helpers (used by the /api/auth/otp route) ───

export function createOTP(email: string): string {
  const code = generateOTP();
  otpStore.set(email, {
    code,
    expires: Date.now() + 10 * 60 * 1000, // 10 minutes
  });
  console.log(`[OTP] Code for ${email}: ${code}`); // Dev logging
  return code;
}

export function verifyOTPExists(email: string): boolean {
  const stored = otpStore.get(email);
  if (!stored) return false;
  if (Date.now() > stored.expires) {
    otpStore.delete(email);
    return false;
  }
  return true;
}
