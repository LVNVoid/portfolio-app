import { prisma } from "@/lib/prisma";

export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      nim: true,
      nidn: true,
    },
  });
  return users;
};

export const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        accounts: true,
        sessions: true,
        Portfolio: true,
      },
    });
    return user;
  } catch (error) {
    console.error("Failed to fetch user by ID:", error);
    throw new Error("Failed to fetch user");
  }
};
