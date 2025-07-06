import { getAllUsers } from "@/actions/user";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";

const UsersPage = async () => {
  const users = await getAllUsers();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Daftar Pengguna</h1>
        <p className="text-muted-foreground">Kelola data pengguna sistem</p>
      </div>
      <DataTable columns={columns} data={users} />
    </div>
  );
};

export default UsersPage;
