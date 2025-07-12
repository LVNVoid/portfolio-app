"use client";

import { useTransition, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export function DeletePortfolioModal({
  portfolioId,
  trigger,
}: {
  portfolioId: string;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [isPending] = useTransition();
  const router = useRouter();

  const handleDelete = async () => {
    const res = await fetch(`/api/portfolio/${portfolioId}`, {
      method: "DELETE",
    });
    const json = await res.json();

    if (res.ok) {
      toast.success("Portfolio berhasil dihapus");
      setOpen(false);
      router.refresh();
    } else {
      toast.error(json.error || "Gagal menghapus");
      throw new Error(json.error || "Delete failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hapus Portofolio</DialogTitle>
        </DialogHeader>
        <div className="py-2 text-sm text-muted-foreground">
          Apakah kamu yakin ingin menghapus portofolio ini? Tindakan ini tidak
          dapat dibatalkan.
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Batal
          </Button>
          <Button
            onClick={handleDelete}
            variant="destructive"
            disabled={isPending}
          >
            {isPending ? "Menghapus..." : "Hapus"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
