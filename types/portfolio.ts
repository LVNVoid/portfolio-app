export type PortfolioLevel = "universitas" | "nasional" | "regional";

export type PortfolioCategory = "kegiatan" | "prestasi";

export type PortfolioTable = {
  id: string;
  title: string;
  description: string;
  level: PortfolioLevel;
  category: PortfolioCategory;
  docsUrl: string | null;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  userName: string | null;
  dateFormatted: string;
  userId: string;
};
