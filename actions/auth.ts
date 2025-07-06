"use server";

import { registerSchema, signInSchema } from "@/lib/schemas/auth";
import { hashSync } from "bcrypt-ts";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";

export const signUpCredentials = async (
  prevState: unknown,
  formData: FormData
) => {
  const validatedFields = registerSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, nim, password } = validatedFields.data;
  const hashedPassword = hashSync(password, 10);

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { nim }],
      },
    });

    if (existingUser) {
      return {
        error: {
          general: ["User with this Email or NIM already exists"],
        },
      };
    }

    await prisma.user.create({
      data: {
        name,
        email,
        nim,
        password: hashedPassword,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return {
      error: {
        general: ["Failed to register user. Please try again."],
      },
    };
  }

  redirect("/login");
};

export const signInCredentials = async (
  prevState: unknown,
  formData: FormData
) => {
  const validatedFields = signInSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { nim, password } = validatedFields.data;

  try {
    await signIn("credentials", { nim, password, redirectTo: "/dashboard" });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { message: "Invalid Credentials." };
        default:
          return { message: "Something went wrong." };
      }
    }
    throw error;
  }
};
