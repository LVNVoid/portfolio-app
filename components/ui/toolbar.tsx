"use client";

import { Input } from "@/components/ui/input";

interface DataTableToolbarProps {
  filterValue: string;
  setFilterValue: (value: string) => void;
}

export function DataTableToolbar({
  filterValue,
  setFilterValue,
}: DataTableToolbarProps) {
  return (
    <div className="flex items-center py-4">
      <Input
        placeholder="Cari nama/email/NIM/NIDN..."
        value={filterValue}
        onChange={(e) => setFilterValue(e.target.value)}
        className="max-w-sm"
      />
    </div>
  );
}
