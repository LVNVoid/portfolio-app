"use client";

import { useTransition, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { createPortfolio } from "@/actions/portfolio";
import toast from "react-hot-toast";
import { PdfUploader } from "../ui/pdf-uploader";

export function AddPortfolioModal({ trigger }: { trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfPublicId, setPdfPublicId] = useState("");

  const [level, setLevel] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = (formData: FormData) => {
    if (selectedDate) formData.set("date", selectedDate.toISOString());
    formData.set("level", level);
    formData.set("category", category);

    startTransition(() => {
      createPortfolio(formData)
        .then(() => {
          toast.success("Portofolio berhasil ditambahkan");
          setOpen(false);
          setPdfUrl("");
          setLevel("");
          setCategory("");
        })
        .catch(() => {
          toast.error("Gagal menambahkan portofolio");
        });
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto bg-background text-foreground">
        <form action={handleSubmit} className="space-y-6">
          <DialogHeader className="pb-4 border-b border-border">
            <DialogTitle className="text-xl font-semibold">
              Tambah Portofolio
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Lengkapi data portofolio Anda dengan informasi yang detail
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">
                Judul <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Masukkan judul portofolio"
                required
                className="focus-visible:ring-2 focus-visible:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">
                Tingkat <span className="text-red-500">*</span>
              </Label>
              <Select required onValueChange={setLevel}>
                <SelectTrigger className="focus-visible:ring-2 focus-visible:ring-blue-500">
                  <SelectValue placeholder="Pilih tingkat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="universitas">🎓 Universitas</SelectItem>
                  <SelectItem value="nasional">🏆 Nasional</SelectItem>
                  <SelectItem value="regional">🌏 Regional</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" name="level" value={level} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="category">
                Kategori <span className="text-red-500">*</span>
              </Label>
              <Select required onValueChange={setCategory}>
                <SelectTrigger className="focus-visible:ring-2 focus-visible:ring-blue-500">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kegiatan">📋 Kegiatan</SelectItem>
                  <SelectItem value="prestasi">🏅 Prestasi</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" name="category" value={category} />
            </div>

            <div className="space-y-2">
              <Label>
                Tanggal <span className="text-red-500">*</span>
              </Label>
              <DatePicker date={selectedDate} onChange={setSelectedDate} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Deskripsi <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Jelaskan detail portofolio Anda..."
              required
              className="min-h-[100px] focus-visible:ring-2 focus-visible:ring-blue-500"
            />
          </div>

          <PdfUploader
            onUploaded={({ url, publicId }) => {
              setPdfUrl(url);
              setPdfPublicId(publicId);
            }}
          />

          <input type="hidden" name="docsUrl" value={pdfUrl} />
          <input type="hidden" name="docsPublicId" value={pdfPublicId} />

          <DialogFooter className="pt-6 border-t border-border">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                className="mr-2"
              >
                Batal
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Menyimpan...
                </>
              ) : (
                "Simpan Portofolio"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
