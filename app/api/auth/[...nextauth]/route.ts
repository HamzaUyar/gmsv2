import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { SessionUser } from "../../../types";

// For demonstration, using a mock auth provider
export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "UBYS Credentials",
      credentials: {
        username: { label: "UBYS ID", type: "text", placeholder: "ubys_xxx" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          // Use absolute URL with proper error handling
          const baseUrl = process.env.NEXTAUTH_URL || 
                          (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
                          
          const response = await fetch(`${baseUrl}/api/mock/ubys/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
            }),
            // Add timeout to prevent hanging requests
            cache: "no-store",
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error(`Auth API returned ${response.status}: ${errorText}`);
            return null;
          }

          const user = await response.json();
          return user;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Pass all user properties to the token
        token.user = user as SessionUser;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      // Pass all token.user properties to the session.user
      session.user = token.user;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET || "CHANGE_THIS_SECRET_IN_YOUR_ENV_FILE",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 