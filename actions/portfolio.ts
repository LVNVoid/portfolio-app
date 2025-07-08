"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PortfolioTable } from "@/types/portfolio";
import { PortfolioCategory, PortfolioLevel } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const getAllPortfolio = async (): Promise<PortfolioTable[]> => {
  const portfolios = await prisma.portfolio.findMany({
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      date: "desc",
    },
  });

  return portfolios.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    level: p.level,
    category: p.category,
    docsUrl: p.docsUrl,
    date: p.date,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    userId: p.userId,
    userName: p.user.name,
    dateFormatted: new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
    }).format(p.date),
  }));
};

export async function createPortfolio(formData: FormData) {
  const session = await auth();
  const user = session?.user;

  if (!user?.id) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const level = formData.get("level") as PortfolioLevel;
  const category = formData.get("category") as PortfolioCategory;
  const docsUrl = formData.get("docsUrl") as string;
  const date = formData.get("date") as string;

  await prisma.portfolio.create({
    data: {
      title,
      description,
      level,
      category,
      docsUrl: docsUrl || null,
      date: new Date(date),
      userId: user.id,
    },
  });

  revalidatePath("/portfolio");
}
