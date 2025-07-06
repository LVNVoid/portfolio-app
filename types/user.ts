export type UserTable = {
  id: string;
  name: string;
  email: string;
  role: "mahasiswa" | "dosen";
  nim: string | null;
  nidn: string | null;
  image: string | null;
};
