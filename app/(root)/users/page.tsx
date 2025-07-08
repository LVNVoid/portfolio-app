import { getAllUsers } from "@/actions/user";
import { columns } from "./columns";
import { DataTable } from "./data-table";

const UsersPage = async () => {
  const users = await getAllUsers();

  return (
    <div className="container mx-auto">
      <div className="w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Data Pengguna
          </h1>
          <p className="text-muted-foreground">Kelola data pengguna</p>
        </div>
        <DataTable columns={columns} data={users} />
      </div>
    </div>
  );
};

export default UsersPage;
