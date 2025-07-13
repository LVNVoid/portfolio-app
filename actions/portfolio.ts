"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PortfolioCategory, PortfolioLevel } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const getAllPortfolio = async () => {
  const portfolios = await prisma.portfolio.findMany({
    include: {
      user: true,
    },
  });
  return portfolios;
};

export async function createPortfolio(formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const level = formData.get("level") as PortfolioLevel;
  const category = formData.get("category") as PortfolioCategory;
  const docsUrl = formData.get("docsUrl") as string | null;
  const docsPublicId = formData.get("docsPublicId") as string | null;
  const dateRaw = formData.get("date") as string;

  const date = new Date(dateRaw);

  await prisma.portfolio.create({
    data: {
      title,
      description,
      level,
      category,
      docsUrl: docsUrl || null,
      docsPublicId: docsPublicId || null,
      date,
      userId,
    },
  });

  revalidatePath("/portfolio");
}

export const getPortfolio = async (id: string) => {
  const portfolio = await prisma.portfolio.findUnique({ where: { id } });
  return portfolio;
};
