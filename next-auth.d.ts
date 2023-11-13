import NextAuth, { DefaultSession, User } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      uid: string;
      username: string;
    };
  }
  interface User extends User {
    username: string;
  }
}
