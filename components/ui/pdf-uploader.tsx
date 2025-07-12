"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, FileText, X, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export function PdfUploader({
  onUploaded,
}: {
  onUploaded: (data: { url: string; publicId: string }) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleUpload = async (file: File) => {
    if (!file) return toast.error("Silakan pilih file PDF.");
    if (file.type !== "application/pdf")
      return toast.error("Hanya file PDF yang diperbolehkan.");
    if (file.size > 10 * 1024 * 1024)
      return toast.error("Ukuran file melebihi 10MB.");

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const res = await fetch("/api/upload-pdf", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.url && data.public_id) {
        toast.success("Upload PDF berhasil!");
        setUploadedFile(file.name);
        onUploaded({ url: data.url, publicId: data.public_id });
      } else {
        toast.error(data.error || "Upload gagal.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan saat upload.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Upload Dokumen PDF</Label>

      {!uploadedFile && !loading && (
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver
              ? "border-blue-400 bg-blue-50 dark:bg-blue-900"
              : "border-muted hover:border-foreground"
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragOver(false);
          }}
        >
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground mb-2">
            Drag & drop file PDF di sini, atau{" "}
            <label className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium">
              pilih file
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </p>
          <p className="text-xs text-muted-foreground">
            Maksimal 10MB • Format: PDF
          </p>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center p-8 border-2 border-dashed border-muted rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-sm text-muted-foreground">Mengupload file...</p>
          </div>
        </div>
      )}

      {uploadedFile && !loading && (
        <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-800 rounded-full">
              <FileText className="h-5 w-5 text-green-600 dark:text-green-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                {uploadedFile}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400">
                Upload berhasil
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-300" />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setUploadedFile(null);
                onUploaded({ url: "", publicId: "" });
              }}
              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
