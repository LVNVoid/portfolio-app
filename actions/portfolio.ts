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

export async function deletePortfolio(id: string) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const portfolio = await prisma.portfolio.findUnique({
    where: { id },
  });

  if (!portfolio || portfolio.userId !== userId) {
    throw new Error("Portfolio tidak ditemukan atau tidak memiliki akses.");
  }

  if (portfolio.docsUrl) {
    const publicId = getCloudinaryPublicId(portfolio.docsUrl);
    if (publicId) {
      await deleteFileFromCloudinary(publicId);
    }
  }

  await prisma.portfolio.delete({ where: { id } });

  revalidatePath("/portfolio");
}

function getCloudinaryPublicId(url: string): string | null {
  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    // More flexible regex to handle different URL formats
    const patterns = [
      // Standard raw upload URL
      new RegExp(
        `https://res.cloudinary.com/${cloudName}/raw/upload/v\\d+/(.+)\\.pdf`
      ),
      // URL without version
      new RegExp(
        `https://res.cloudinary.com/${cloudName}/raw/upload/(.+)\\.pdf`
      ),
      // URL with transformations
      new RegExp(
        `https://res.cloudinary.com/${cloudName}/raw/upload/(?:v\\d+/)?(.+)\\.pdf`
      ),
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        // Remove any remaining path segments that might be transformations
        const publicId = match[1].split("/").pop() || match[1];
        console.log("Extracted public ID:", publicId, "from URL:", url);
        return publicId;
      }
    }

    console.warn("Could not extract public ID from URL:", url);
    return null;
  } catch (error) {
    console.error("Error extracting public ID:", error);
    return null;
  }
}

async function deleteFileFromCloudinary(publicId: string) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Konfigurasi Cloudinary tidak lengkap.");
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const crypto = await import("crypto");

  // Fixed: Correct string to sign format - no resource_type parameter needed
  const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto
    .createHash("sha1")
    .update(stringToSign)
    .digest("hex");

  const formData = new URLSearchParams();
  formData.append("public_id", publicId);
  formData.append("timestamp", timestamp.toString());
  formData.append("api_key", apiKey);
  formData.append("signature", signature);
  // Add resource_type to the form data instead of signature string
  formData.append("resource_type", "raw");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/raw/destroy`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();

  // Handle successful deletion or file not found (both are acceptable outcomes)
  if (data.result === "ok" || data.result === "not found") {
    if (data.result === "not found") {
      console.warn(
        "File not found in Cloudinary, possibly already deleted:",
        publicId
      );
    }
    return; // Success - file is deleted or doesn't exist
  }

  // Only throw error for actual failures
  if (!res.ok || (data.result !== "ok" && data.result !== "not found")) {
    console.error("Gagal menghapus file Cloudinary:", data);
    throw new Error("Cloudinary delete failed: " + JSON.stringify(data));
  }
}
