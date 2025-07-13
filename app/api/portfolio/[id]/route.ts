import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { cloudinary } from "@/lib/cloudinary";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;

  try {
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

    if (portfolio.docsPublicId) {
      await cloudinary.uploader.destroy(portfolio.docsPublicId, {
        resource_type: "raw",
      });
    }

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
