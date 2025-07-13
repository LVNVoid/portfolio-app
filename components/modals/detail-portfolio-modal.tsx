"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getPortfolio } from "@/actions/portfolio";
import { X, Download } from "lucide-react";
import { Portfolio } from "@prisma/client";

interface DetailModalPortfolioProps {
  portfolioId: string;
  trigger: React.ReactNode;
}

export function DetailModalPortfolio({
  portfolioId,
  trigger,
}: DetailModalPortfolioProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (!open) return;
    startTransition(async () => {
      const data = await getPortfolio(portfolioId);
      setPortfolio(data);
    });
  }, [open, portfolioId]);

  const handleDownloadPDF = async () => {
    if (!portfolio?.docsUrl || isDownloading) return;

    setIsDownloading(true);

    try {
      // Fetch the file from the URL
      const response = await fetch(portfolio.docsUrl);
      if (!response.ok) throw new Error("Failed to fetch file");

      // Get the file as blob
      const blob = await response.blob();

      // Create a blob URL
      const blobUrl = URL.createObjectURL(blob);

      // Create a temporary anchor element to trigger download
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${portfolio.title}_portfolio.pdf`; // Force .pdf extension
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading file:", error);
      // Fallback to direct link if fetch fails
      const link = document.createElement("a");
      link.href = portfolio.docsUrl;
      link.download = `${portfolio.title}_portfolio.pdf`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between gap-2">
            Detail Portfolio
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        {isPending || !portfolio ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-96 w-full" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold">Judul</p>
                <p>{portfolio.title}</p>
              </div>
              <div>
                <p className="font-semibold">Deskripsi</p>
                <p>{portfolio.description ?? "-"}</p>
              </div>
              <div>
                <p className="font-semibold">Tingkat</p>
                <p>{portfolio.level}</p>
              </div>
              <div>
                <p className="font-semibold">Kategori</p>
                <p>{portfolio.category}</p>
              </div>
              <div>
                <p className="font-semibold">Tanggal</p>
                <p>
                  {new Date(portfolio.date).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {portfolio.docsUrl ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Dokumen</h3>
                  <Button
                    onClick={handleDownloadPDF}
                    size="sm"
                    className="flex items-center gap-2"
                    disabled={isDownloading}
                  >
                    <Download className="w-4 h-4" />
                    {isDownloading ? "Downloading..." : "Download PDF"}
                  </Button>
                </div>
                <iframe
                  src={`https://docs.google.com/gview?url=${encodeURIComponent(
                    portfolio.docsUrl
                  )}&embedded=true`}
                  className="w-full h-96"
                  title="Preview PDF"
                />
              </div>
            ) : (
              <p className="text-muted-foreground text-sm italic">
                Tidak ada dokumen terlampir.
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
