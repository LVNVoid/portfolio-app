import LoginForm from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="p-2 space-y-4">
      <h1 className="text-2xl font-bold">Sign In to your account</h1>
      <LoginForm />
    </div>
  );
}
