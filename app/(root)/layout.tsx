import MainLayout from "@/components/layouts/main-layout";

const SetupLayout = ({ children }: { children: React.ReactNode }) => {
  return <MainLayout>{children}</MainLayout>;
};

export default SetupLayout;
