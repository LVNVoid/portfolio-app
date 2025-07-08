export type Role = "admin" | "dosen" | "mahasiswa";

export type UserTable = {
  id: string;
  name: string;
  email: string;
  role: Role;
  identifier: string | null;
  image: string | null;
};
