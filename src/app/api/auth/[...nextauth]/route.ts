import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";


export const authOptions:NextAuthOptions = ({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        //El (!) al final fuerza a Typescript a que tome el valor entrante , y que no será undefined
    ],
    session:{
        strategy:"jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if(session.user){

                session.user.id = token.id as string;
            }
            return session;
        },
        async redirect({ baseUrl}){
            return `${baseUrl}/login/result`;
        }
    },
});

// const handler = NextAuth(authOptions);

export { NextAuth as GET, NextAuth as POST };