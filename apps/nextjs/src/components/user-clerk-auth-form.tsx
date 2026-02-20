"use client";

import * as React from "react";
import { redirect } from "next/navigation";
import { SignIn, useUser } from "@clerk/nextjs";

import { cn } from "@saasfly/ui";

type Dictionary = Record<string, string>;

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  lang: string;
  dict?: Dictionary;
  disabled?: boolean;
}

export function UserClerkAuthForm({
  className,
  lang,
  ...props
}: UserAuthFormProps) {
  const useUserTyped = useUser as unknown as () => {
    user: { id: string } | null;
  };
  const SignInTyped = SignIn as unknown as React.ComponentType<{
    withSignUp?: boolean;
    fallbackRedirectUrl?: string;
  }>;
  const cnTyped = cn as unknown as (...inputs: unknown[]) => string;
  const { user } = useUserTyped();
  if (user) {
    redirect(`/${lang}/dashboard`)
  }

  return (
    <div className={cnTyped("grid gap-6", className)} {...props}>
      <SignInTyped
        withSignUp={false}
        fallbackRedirectUrl={`/${lang}/dashboard`}
      />
    </div>
  );
}
