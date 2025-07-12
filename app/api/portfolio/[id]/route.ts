import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@/auth";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth(); // ⇢ pastikan user login
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;

  try {
    // 1. Dapatkan data portfolio (cek owner juga, bila perlu)
    const portfolio = await prisma.portfolio.findUnique({ where: { id } });
    if (!portfolio) {
      return NextResponse.json(
        { error: "Data tidak ditemukan" },
        { status: 404 }
      );
    }
    if (portfolio.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 2. Hapus file dari Cloudinary (jika ada publicId)
    if (portfolio.docsPublicId) {
      await cloudinary.uploader.destroy(portfolio.docsPublicId, {
        resource_type: "raw",
      });
    }

    // 3. Hapus record dari database
    await prisma.portfolio.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete portfolio error:", err);
    return NextResponse.json(
      { error: "Gagal menghapus portfolio" },
      { status: 500 }
    );
  }
}
