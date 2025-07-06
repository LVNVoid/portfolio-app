"use client";

import { useState, useEffect, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { updateUser, getUser } from "@/actions/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import { userEditSchema, UserEditSchema } from "@/lib/schemas/user";
import { GraduationCap, UserCheck, Loader2 } from "lucide-react";

interface EditUserModalProps {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditUserModal({
  userId,
  open,
  onOpenChange,
}: EditUserModalProps) {
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm<UserEditSchema>({
    resolver: zodResolver(userEditSchema),
  });

  const role = watch("role");

  useEffect(() => {
    if (open && userId) {
      setLoading(true);
      getUser(userId)
        .then((data) => {
          if (data) {
            const safeUser: UserEditSchema = {
              id: data.id,
              name: data.name ?? "",
              email: data.email ?? "",
              role: data.role as "mahasiswa" | "dosen" | "admin",
              nim: data.nim ?? undefined,
              nidn: data.nidn ?? undefined,
            };
            reset(safeUser);
          } else {
            toast.error("User tidak ditemukan");
            onOpenChange(false);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [open, userId, reset, onOpenChange]);

  const onSubmit = (data: UserEditSchema) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value ?? "");
      }
    });

    startTransition(() => {
      updateUser(formData)
        .then((res) => {
          if (res?.success) {
            toast.success("User berhasil diupdate");
            onOpenChange(false);
          } else if (res?.error) {
            const errors = res.error;
            if (errors.name?.[0]) toast.error(`Nama: ${errors.name[0]}`);
            if (errors.email?.[0]) toast.error(`Email: ${errors.email[0]}`);
            if (errors.role?.[0]) toast.error(`Role: ${errors.role[0]}`);
            if (errors.nim?.[0]) toast.error(`NIM: ${errors.nim[0]}`);
            if (errors.nidn?.[0]) toast.error(`NIDN: ${errors.nidn[0]}`);
          } else {
            toast.error("Gagal update user");
          }
        })
        .catch(() => toast.error("Terjadi kesalahan saat mengupdate user"));
    });
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="space-y-2">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <UserCheck className="h-5 w-5" />
            Edit Pengguna
          </DialogTitle>
          <DialogDescription>
            Perbarui informasi pengguna. Pastikan semua data sudah benar sebelum
            menyimpan.
          </DialogDescription>
        </DialogHeader>

        <Separator />

        {loading ? (
          <div className="text-center py-10 text-muted-foreground">
            Memuat data pengguna...
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" {...register("id")} />

            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input
                id="name"
                placeholder="Masukkan nama lengkap"
                {...register("name")}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500">⚠ {errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="contoh@email.com"
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">⚠ {errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role Pengguna</Label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger
                      className={errors.role ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Pilih role pengguna" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mahasiswa">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4" />
                          Mahasiswa
                        </div>
                      </SelectItem>
                      <SelectItem value="dosen">
                        <div className="flex items-center gap-2">
                          <UserCheck className="h-4 w-4" />
                          Dosen
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.role && (
                <p className="text-sm text-red-500">⚠ {errors.role.message}</p>
              )}
            </div>

            {role === "mahasiswa" && (
              <div className="space-y-2">
                <Label htmlFor="nim">NIM</Label>
                <Input
                  id="nim"
                  placeholder="Masukkan NIM"
                  {...register("nim")}
                />
                {errors.nim && (
                  <p className="text-sm text-red-500">⚠ {errors.nim.message}</p>
                )}
              </div>
            )}

            {role === "dosen" && (
              <div className="space-y-2">
                <Label htmlFor="nidn">NIDN</Label>
                <Input
                  id="nidn"
                  placeholder="Masukkan NIDN"
                  {...register("nidn")}
                />
                {errors.nidn && (
                  <p className="text-sm text-red-500">
                    ⚠ {errors.nidn.message}
                  </p>
                )}
              </div>
            )}

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  "Simpan"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
