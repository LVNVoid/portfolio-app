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
    accessorKey: "identifier",
    header: "NIM / NIDN",
  },
  {
    id: "actions",
    cell: ({ row }) => <UserActionsCell user={row.original} />,
  },
];
