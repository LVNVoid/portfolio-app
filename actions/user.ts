"use server";

import { prisma } from "@/lib/prisma";
import { userEditSchema } from "@/lib/schemas/user";
import { User } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      nim: true,
      nidn: true,
    },
  });
  return users;
};

export const updateUser = async (formData: FormData) => {
  const values = Object.fromEntries(formData.entries());
  const parsed = userEditSchema.safeParse(values);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { id, name, email, role, nim, nidn } = parsed.data;

  await prisma.user.update({
    where: { id },
    data: {
      name,
      email,
      role,
      nim: role === "mahasiswa" ? nim : null,
      nidn: role === "dosen" ? nidn : null,
    },
  });

  revalidatePath("/dashboard/users");
  return { success: true };
};

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({
      where: { id },
    });

    revalidatePath("/dashboard/users");

    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error: "Gagal menghapus pengguna" };
  }
}

export async function getUser(userId: string): Promise<User | null> {
  return await prisma.user.findUnique({
    where: { id: userId },
  });
}
