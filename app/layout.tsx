import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ToasterProvider } from "@/components/providers/toast-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sertifikat Mahasiswa",
  description:
    "Platform web untuk mahasiswa mengumpulkan dan mengelola sertifikat prestasi maupun kegiatan selama masa perkuliahan.",
  keywords: [
    "sertifikat mahasiswa",
    "prestasi",
    "kegiatan kampus",
    "pengumpulan sertifikat",
    "aplikasi mahasiswa",
    "manajemen prestasi",
  ],
  authors: [{ name: "Tim Pengembang Sertifikat Mahasiswa" }],
  creator: "Elvien Purnawan",
  metadataBase: new URL("https://sertifikatmahasiswa.vercel.app"),
  openGraph: {
    title: "Sertifikat Mahasiswa",
    description:
      "Bantu mahasiswa mencatat dan mengelola sertifikat kegiatan dan prestasi dengan mudah.",
    url: "https://sertifikatmahasiswa.vercel.app",
    siteName: "Sertifikat Mahasiswa",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={cn(
          inter.className,
          "scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent"
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ToasterProvider />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
