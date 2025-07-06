import { auth } from "@/auth";

const DashboardPage = async () => {
  const session = await auth();
  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Hi {session?.user.name}!</p>
      </div>
    </div>
  );
};

export default DashboardPage;
