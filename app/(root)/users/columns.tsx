"use client";

import { ColumnDef } from "@tanstack/react-table";
import { UserActionsCell } from "./user-action-cell";
import { UserTable } from "@/types/user";

export const columns: ColumnDef<UserTable>[] = [
  {
    accessorKey: "name",
    header: "Nama",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    id: "identitas",
    header: "NIM / NIDN",
    cell: ({ row }) => {
      const user = row.original;
      return user.role === "mahasiswa" ? user.nim ?? "-" : user.nidn ?? "-";
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <UserActionsCell user={row.original} />,
  },
];
