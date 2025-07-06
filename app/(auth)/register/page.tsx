import RegisterForm from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="p-2 space-y-4">
      <h1 className="text-2xl font-bold">Create an account</h1>
      <RegisterForm />
    </div>
  );
}
