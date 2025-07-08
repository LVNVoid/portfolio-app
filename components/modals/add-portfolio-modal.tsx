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
import { createPortfolio } from "@/actions/portfolio";

export function AddPortfolioModal({ trigger }: { trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(() => {
      createPortfolio(formData).then(() => {
        setOpen(false);
      });
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form action={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Tambah Portofolio</DialogTitle>
            <DialogDescription>Lengkapi data portofolio Anda</DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            <Label htmlFor="title">Judul</Label>
            <Input id="title" name="title" required />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea id="description" name="description" required />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="level">Tingkat</Label>
            <Select name="level" required>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Tingkat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="universitas">Universitas</SelectItem>
                <SelectItem value="nasional">Nasional</SelectItem>
                <SelectItem value="regional">Regional</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-3">
            <Label htmlFor="category">Kategori</Label>
            <Select name="category" required>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kegiatan">Kegiatan</SelectItem>
                <SelectItem value="prestasi">Prestasi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-3">
            <Label htmlFor="docsUrl">Dokumen URL (opsional)</Label>
            <Input id="docsUrl" name="docsUrl" type="url" />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="date">Tanggal</Label>
            <Input id="date" name="date" type="date" required />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isPending}>
                Batal
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
