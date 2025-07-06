// file: components/modals/detail-user-modal.tsx
"use client";

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
  User,
  Mail,
  GraduationCap,
  UserCheck,
  Calendar,
  Hash,
} from "lucide-react";

interface UserDetailModalProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: "mahasiswa" | "dosen";
    nim?: string | null;
    nidn?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailModal({
  user,
  open,
  onOpenChange,
}: UserDetailModalProps) {
  const formatDate = (date: Date | string | undefined) => {
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadge = (role: string) => {
    if (role === "mahasiswa") {
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          <GraduationCap className="h-3 w-3 mr-1" />
          Mahasiswa
        </Badge>
      );
    } else {
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          <UserCheck className="h-3 w-3 mr-1" />
          Dosen
        </Badge>
      );
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

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.name
                )}&background=random`}
              />
              <AvatarFallback className="bg-gray-100 text-gray-600 text-lg font-medium">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{user.email}</p>
              {getRoleBadge(user.role)}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium ">Informasi Detail</h4>

            <div className="grid grid-cols-1 gap-4">
              <InfoItem icon={<Hash />} label="ID Pengguna" value={user.id} />
              <InfoItem
                icon={<User />}
                label="Nama Lengkap"
                value={user.name}
              />
              <InfoItem icon={<Mail />} label="Email" value={user.email} />
              <InfoItem
                icon={
                  user.role === "mahasiswa" ? <GraduationCap /> : <UserCheck />
                }
                label="Role"
                value={user.role}
              />
              {user.role === "mahasiswa" && (
                <InfoItem icon={<Hash />} label="NIM" value={user.nim || "-"} />
              )}
              {user.role === "dosen" && (
                <InfoItem
                  icon={<Hash />}
                  label="NIDN"
                  value={user.nidn || "-"}
                />
              )}
              {user.createdAt && (
                <InfoItem
                  icon={<Calendar />}
                  label="Dibuat"
                  value={formatDate(user.createdAt)}
                />
              )}
              {user.updatedAt && (
                <InfoItem
                  icon={<Calendar />}
                  label="Diperbarui"
                  value={formatDate(user.updatedAt)}
                />
              )}
            </div>
          </div>
        </div>

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
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-muted-foreground">{icon}</div>
      <div className="flex-1">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-sm ">{value}</p>
      </div>
    </div>
  );
}
