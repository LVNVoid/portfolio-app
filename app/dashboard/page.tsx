import { auth } from "@/auth";

const DashboardPage = async () => {
  const session = await auth();
  return (
    <div className="max-w-screen-xl mx-auto py-6 p-4">
      <h1 className="text-2xl">Dashboard</h1>
      <h2 className="text-xl">
        Welcome back <span>{session?.user?.name}</span>
      </h2>
    </div>
  );
};

export default DashboardPage;
