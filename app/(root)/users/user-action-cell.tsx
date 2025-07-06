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
  const [openEdit, setOpenEdit] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setOpenDetail(true)}>
            Detail
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenEdit(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenDelete(true)}>
            Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditUserModal user={user} open={openEdit} onOpenChange={setOpenEdit} />
      <UserDetailModal
        user={user}
        open={openDetail}
        onOpenChange={setOpenDetail}
      />
      <DeleteUserModal
        userId={user.id}
        userName={user.name}
        open={openDelete}
        onOpenChange={setOpenDelete}
      />
    </>
  );
}
