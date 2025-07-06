"use client";

import { useState, InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function PasswordInput({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        {...props}
        type={showPassword ? "text" : "password"}
        className={`pr-10 ${className}`}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
        tabIndex={-1}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4 text-gray-500" />
        ) : (
          <Eye className="h-4 w-4 text-gray-500" />
        )}
      </Button>
    </div>
  );
}
