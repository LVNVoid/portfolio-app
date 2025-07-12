import { columns } from "./columns";
import { DataTable } from "./data-table";
import { getAllPortfolio } from "@/actions/portfolio";
import { AddPortfolioModal } from "@/components/modals/add-portfolio-modal";
import { Button } from "@/components/ui/button";

const PortfolioPage = async () => {
  const portfolios = await getAllPortfolio();

  console.log(portfolios);

  return (
    <div className="container mx-auto">
      <div className="w-full">
        <div className="flex justify-between items-center">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Portofolio
            </h1>
            <p className="text-muted-foreground">Kelola data portofolio</p>
          </div>
          <div>
            <AddPortfolioModal
              trigger={<Button variant="outline">Tambah Portfolio</Button>}
            />
          </div>
        </div>
        <DataTable columns={columns} data={portfolios} />
      </div>
    </div>
  );
};

export default PortfolioPage;
