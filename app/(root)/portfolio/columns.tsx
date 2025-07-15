"use client";

import { DeletePortfolioModal } from "@/components/modals/delete-portfolio-modal";
import { DetailModalPortfolio } from "@/components/modals/detail-portfolio-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PortfolioWithUser } from "@/types/portfolio";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

export const columns: ColumnDef<PortfolioWithUser>[] = [
  {
    accessorFn: (row) => row.user?.name,
    id: "userName",
    header: "Author",
  },
  {
    accessorKey: "title",
    header: "Judul",
  },
  {
    accessorKey: "level",
    header: "Tingkat",
  },
  {
    accessorKey: "category",
    header: "Kategori",
  },
  {
    id: "date",
    header: "Tanggal",
    cell: ({ row }) => {
      const date = row.original.date;

      if (!date) return "-";

      const formatted = new Date(date).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

      return formatted;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const portfolio = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(portfolio.id)}
            >
              Copy Portfolio ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <DetailModalPortfolio
                portfolioId={portfolio.id}
                trigger={
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-8 px-2"
                  >
                    Detail
                  </Button>
                }
              />
            </DropdownMenuItem>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem asChild>
              <DeletePortfolioModal
                portfolioId={portfolio.id}
                trigger={
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-8 px-2 text-red-500 hover:text-red-700"
                  >
                    Delete
                  </Button>
                }
              />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
