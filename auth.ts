import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/prisma";
import Credentials from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts";
import { signInSchema } from "./lib/schemas/auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        nim: { label: "NIM", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const validatedCredentials = signInSchema.safeParse(credentials);

        if (!validatedCredentials.success) {
          return null;
        }

        const { nim, password } = validatedCredentials.data;

        const user = await prisma.user.findUnique({
          where: { nim },
        });

        if (!user || !user.password) {
          throw new Error("No user found");
        }

        const passwordMatch = compareSync(password, user.password);

        if (!passwordMatch) return null;

        return user;
      },
    }),
  ],
});
