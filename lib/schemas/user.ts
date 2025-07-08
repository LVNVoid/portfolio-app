import { z } from "zod";

export const userEditSchema = z
  .object({
    id: z.string(),
    name: z.string().min(1, "Nama wajib diisi"),
    email: z.string().email("Format email tidak valid"),
    role: z.enum(["mahasiswa", "dosen", "admin"]),
    identifier: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      (data.role === "mahasiswa" || data.role === "dosen") &&
      !data.identifier?.trim()
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["identifier"],
        message: `${data.role === "mahasiswa" ? "NIM" : "NIDN"} wajib diisi`,
      });
    }
  });

export type UserEditSchema = z.infer<typeof userEditSchema>;
