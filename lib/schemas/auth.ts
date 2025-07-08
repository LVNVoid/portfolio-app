import { object, string } from "zod";

export const registerSchema = object({
  name: string().min(1, "Name must be more than 1 character long").max(50),
  email: string().email("Invalid email"),
  identifier: string().length(10, "NIM / NIDN must be 10 characters long"),
  password: string()
    .min(8, "Password must be more than 8 characters long")
    .max(32, "Password must be less than 32 characters long"),
  confirmPassword: string()
    .min(8, "Password must be more than 8 characters long")
    .max(32, "Password must be less than 32 characters long"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const signInSchema = object({
  identifier: string().length(10, "NIM / NIDN must be 10 characters long"),
  password: string()
    .min(8, "Password must be more than 8 characters long")
    .max(32, "Password must be less than 32 characters long"),
});
