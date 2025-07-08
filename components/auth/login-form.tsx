"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signInCredentials } from "@/actions/auth";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { PasswordInput } from "../ui/password-input";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { useFormError } from "@/hooks/useFormError";

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Authenticating...
        </>
      ) : (
        "Sign In"
      )}
    </Button>
  );
};

const LoginForm = () => {
  const [state, formAction] = useActionState(signInCredentials, null);
  const { getFieldError, getGeneralError, hasGeneralError } =
    useFormError(state);

  return (
    <form action={formAction} className="space-y-4">
      <div className="flex flex-col gap-1">
        <Label htmlFor="identifier">NIM / NIDN</Label>
        <Input
          type="text"
          id="identifier"
          name="identifier"
          placeholder="Enter your NIM / NIDN"
        />
        <span className="text-xs font-medium text-red-500">
          {getFieldError("identifier")}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="password">Password</Label>
        <PasswordInput id="password" name="password" />
        <span className="text-xs font-medium text-red-500">
          {getFieldError("password")}
        </span>
      </div>

      {hasGeneralError && (
        <div className="text-sm font-medium text-red-500 text-center">
          {getGeneralError()}
        </div>
      )}

      <div className="flex justify-end">
        <SubmitButton />
      </div>

      <p className="text-sm text-center font-light text-muted-foreground">
        Don&apos;t have an account yet?
        <Link href="/register">
          <span className="pl-1 font-medium text-blue-600 hover:text-blue-700">
            Register now
          </span>
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
