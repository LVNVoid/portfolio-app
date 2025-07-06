"use client";

import { useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";
import { deleteUser } from "@/actions/user";
import toast from "react-hot-toast";

interface DeleteUserModalProps {
  userId: string;
  userName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteUserModal({
  userId,
  userName,
  open,
  onOpenChange,
}: DeleteUserModalProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(() => {
      deleteUser(userId)
        .then((res) => {
          if (res?.success) {
            toast.success("Pengguna berhasil dihapus");
            onOpenChange(false);
          } else {
            toast.error(res?.error || "Gagal menghapus pengguna");
          }
        })
        .catch(() => toast.error("Terjadi kesalahan saat menghapus pengguna"));
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Hapus Pengguna
          </DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus pengguna{" "}
            <strong>{userName}</strong>? Tindakan ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menghapus...
              </>
            ) : (
              "Hapus"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
