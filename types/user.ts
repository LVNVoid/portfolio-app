export type Role = "admin" | "dosen" | "mahasiswa";

export type UserTable = {
  id: string;
  name: string | null;
  email: string | null;
  role: Role;
  identifier: string | null;
  image: string | null;
};
