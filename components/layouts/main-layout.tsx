import Sidebar from "./sidebar";
import TopNav from "./top-nav";

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout = async ({ children }: MainLayoutProps) => {
  const role = "dosen";

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow border-r bg-background overflow-y-auto">
          <Sidebar role={role} />
        </div>
      </div>

      <div className="flex-1 md:ml-64">
        <TopNav />
        <main className="flex-1 p-6">
          <div className="container mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
