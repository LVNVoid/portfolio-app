"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signUpCredentials } from "@/actions/auth";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { PasswordInput } from "../ui/password-input";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Registering...
        </>
      ) : (
        "Register"
      )}
    </Button>
  );
};

const RegisterForm = () => {
  const [state, formAction] = useActionState(signUpCredentials, null);

  return (
    <form action={formAction} className="space-y-4">
      <div className="flex flex-col gap-1">
        <Label htmlFor="name">Name</Label>
        <Input type="text" id="name" name="name" placeholder="John Doe" />
        <span className="text-xs font-medium text-red-500">
          {state?.error?.name}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          name="email"
          placeholder="john@example.com"
        />
        <span className="text-xs font-medium text-red-500">
          {state?.error?.email}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="nim">NIM / NPM</Label>
        <Input type="text" id="nim" name="nim" placeholder="2005040000" />
        <span className="text-xs font-medium text-red-500">
          {state?.error?.nim}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="password">Password</Label>
        <PasswordInput id="password" name="password" />
        <span className="text-xs font-medium text-red-500">
          {state?.error?.password}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <PasswordInput id="confirmPassword" name="confirmPassword" />
        <span className="text-xs font-medium text-red-500">
          {state?.error?.confirmPassword}
        </span>
      </div>

      {state?.error?.general && (
        <div className="text-sm font-medium text-red-500 text-center">
          {state.error.general[0]}
        </div>
      )}

      <div className="flex justify-end">
        <SubmitButton />
      </div>

      <p className="text-sm text-center font-light text-muted-foreground">
        Already have an account?
        <Link href="/login">
          <span className="pl-1 font-medium text-blue-600 hover:text-blue-700">
            Login now
          </span>
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
