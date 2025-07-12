import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json(
      { error: "File tidak ditemukan" },
      { status: 400 }
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const uploadStream = () =>
    new Promise<{ url: string; public_id: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          folder: "pdfs",
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error("Upload gagal"));
          } else {
            resolve({ url: result.secure_url, public_id: result.public_id });
          }
        }
      );

      Readable.from(buffer).pipe(stream);
    });

  try {
    const { url, public_id } = await uploadStream();
    return NextResponse.json({ url, public_id });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json(
      { error: "Upload ke Cloudinary gagal" },
      { status: 500 }
    );
  }
}
