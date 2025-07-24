
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user) return null;
        const valid = await compare(credentials.password, user.password);
        if (!valid) return null;
        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as User & { role: string; id: number };
        return { ...token, id: u.id, role: u.role, name: u.name } as JWT;
      }
      return token as JWT;
    },
    async session({ session, token }) {
      const t = token as JWT & { id?: number; role?: string };
      if (t) {
        session.user = {
          ...(session.user || {}),
          id: t.id as number,
          role: t.role as string,
          name: t.name as string,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
