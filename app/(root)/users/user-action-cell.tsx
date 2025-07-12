"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { EditUserModal } from "@/components/modals/edit-user-modal";
import { UserDetailModal } from "@/components/modals/detail-user-modal";
import { UserTable } from "@/types/user";
import { DeleteUserModal } from "@/components/modals/delete-user-modal";

interface UserActionsCellProps {
  user: UserTable;
}

export function UserActionsCell({ user }: UserActionsCellProps) {
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [detailUserId, setDetailUserId] = useState<string | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setDetailUserId(user.id)}>
            Detail
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setEditUserId(user.id)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDeleteUserId(user.id)}>
            Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {editUserId && (
        <EditUserModal
          userId={editUserId}
          open={!!editUserId}
          onOpenChange={(open) => {
            if (!open) setEditUserId(null);
          }}
        />
      )}

      {detailUserId && (
        <UserDetailModal
          userId={detailUserId}
          open={!!detailUserId}
          onOpenChange={(open) => {
            if (!open) setDetailUserId(null);
          }}
        />
      )}

      {deleteUserId && (
        <DeleteUserModal
          userId={deleteUserId}
          userName={user.name || ""}
          open={!!deleteUserId}
          onOpenChange={(open) => {
            if (!open) setDeleteUserId(null);
          }}
        />
      )}
    </>
  );
}
