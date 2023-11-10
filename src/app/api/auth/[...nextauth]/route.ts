import prisma from "@/lib/prisma";
import { compare } from "bcrypt";
import NextAuth, { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.uid = token.sub!;
        session.user.username = token.username! as string;
      }
      return session;
    },
  },
  providers: [
    Credentials({
      credentials: {
        username: {},
        password: {},
      },
      authorize: async (credentials) => {
        const userExists = await prisma.user.findUnique({
          select: {
            id: true,
            password: true,
            username: true,
          },
          where: {
            username: credentials?.username,
          },
        });

        if (!userExists) return null;

        const validPassword = await compare(
          credentials?.password!,
          userExists.password,
        );

        if (!validPassword) return null;

        return {
          id: userExists.id,
          username: userExists.username,
        };
      },
    }),
  ],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
