import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
        if (session.user) {
            session.user.id = token.id as string;
    }
      return session;
    },
    async redirect({ baseUrl }) {
      return `${baseUrl}/login/result`;
    },
  },
});

export { handler as GET, handler as POST };
