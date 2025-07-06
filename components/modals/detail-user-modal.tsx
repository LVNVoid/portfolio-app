"use client";

import { useEffect, useState } from "react";
import { User } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Eye,
  User as UserIcon,
  Mail,
  GraduationCap,
  UserCheck,
  Calendar,
  Hash,
} from "lucide-react";
import { getUser } from "@/actions/user";

interface UserDetailModalProps {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailModal({
  userId,
  open,
  onOpenChange,
}: UserDetailModalProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (open && userId) {
      setLoading(true);
      getUser(userId)
        .then((data) => {
          if (data) setUser(data);
        })
        .finally(() => setLoading(false));
    }
  }, [open, userId]);

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "-";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadge = (role: User["role"]) => {
    switch (role) {
      case "mahasiswa":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <GraduationCap className="h-3 w-3 mr-1" />
            Mahasiswa
          </Badge>
        );
      case "dosen":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <UserCheck className="h-3 w-3 mr-1" />
            Dosen
          </Badge>
        );
      case "admin":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <UserIcon className="h-3 w-3 mr-1" />
            Admin
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="space-y-2">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Eye className="h-5 w-5" />
            Detail Pengguna
          </DialogTitle>
          <DialogDescription>
            Informasi lengkap mengenai pengguna yang dipilih.
          </DialogDescription>
        </DialogHeader>

        <Separator />

        {loading || !user ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Memuat data pengguna...
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.name ?? "U"
                  )}&background=random`}
                />
                <AvatarFallback className="bg-gray-100 text-gray-600 text-lg font-medium">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{user.name ?? "-"}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {user.email ?? "-"}
                </p>
                {getRoleBadge(user.role)}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">Informasi Detail</h4>
              <div className="grid grid-cols-1 gap-4">
                <InfoItem icon={<Hash />} label="ID Pengguna" value={user.id} />
                <InfoItem
                  icon={<UserIcon />}
                  label="Nama Lengkap"
                  value={user.name}
                />
                <InfoItem icon={<Mail />} label="Email" value={user.email} />
                <InfoItem
                  icon={
                    user.role === "mahasiswa" ? (
                      <GraduationCap />
                    ) : (
                      <UserCheck />
                    )
                  }
                  label="Role"
                  value={user.role}
                />
                {user.role === "mahasiswa" && (
                  <InfoItem icon={<Hash />} label="NIM" value={user.nim} />
                )}
                {user.role === "dosen" && (
                  <InfoItem icon={<Hash />} label="NIDN" value={user.nidn} />
                )}
                <InfoItem
                  icon={<Calendar />}
                  label="Dibuat"
                  value={formatDate(user.createdAt)}
                />
                <InfoItem
                  icon={<Calendar />}
                  label="Diperbarui"
                  value={formatDate(user.updatedAt)}
                />
              </div>
            </div>
          </div>
        )}

        <Separator />

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-muted-foreground">{icon}</div>
      <div className="flex-1">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-sm">{value ?? "-"}</p>
      </div>
    </div>
  );
}
