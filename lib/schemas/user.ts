import { z } from "zod";

export const userEditSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Nama wajib diisi"),
  email: z.string().email("Email tidak valid"),
  role: z.enum(["mahasiswa", "dosen", "admin"]),
  nim: z.string().optional().nullable(),
  nidn: z.string().optional().nullable(),
});

export type UserEditSchema = z.infer<typeof userEditSchema>;
