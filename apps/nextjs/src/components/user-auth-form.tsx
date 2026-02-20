"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm, type Resolver, type UseFormProps, type UseFormReturn } from "react-hook-form";
import type { ZodTypeAny } from "zod";
import * as z from "zod";

import { cn } from "@saasfly/ui";
import { buttonVariants } from "@saasfly/ui/button";
import * as Icons from "@saasfly/ui/icons";
import { Input } from "@saasfly/ui/input";
import { Label } from "@saasfly/ui/label";
import { toast } from "@saasfly/ui/use-toast";

type Dictionary = Record<string, string>;

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  lang: string;
  dict: Dictionary;
  disabled?: boolean;
}

const userAuthSchema = z.object({
  email: z.string().email(),
});

type FormData = z.infer<typeof userAuthSchema>;

export function UserAuthForm({
  className,
  lang,
  dict,
  disabled,
  ...props
}: UserAuthFormProps) {
  const useFormTyped = useForm as unknown as <T>(
    props: UseFormProps<T>,
  ) => UseFormReturn<T>;
  const zodResolverTyped = zodResolver as unknown as <
    TSchema extends ZodTypeAny,
  >(
    schema: TSchema,
  ) => Resolver<z.infer<TSchema>>;
  const signInTyped = signIn as unknown as (
    provider: string,
    options?: { email?: string; redirect?: boolean; callbackUrl?: string },
  ) => Promise<{ ok?: boolean } | undefined>;
  const cnTyped = cn as unknown as (...inputs: unknown[]) => string;
  const buttonVariantsTyped = buttonVariants as unknown as (props?: {
    variant?: string;
  }) => string;
  const toastTyped = toast as unknown as (props: {
    title?: string;
    description?: string;
    variant?: string;
  }) => void;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useFormTyped<FormData>({
    resolver: zodResolverTyped(userAuthSchema),
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isGitHubLoading, setIsGitHubLoading] = React.useState<boolean>(false);
  const searchParams = useSearchParams() as unknown as URLSearchParams | null;

  async function onSubmit(data: FormData) {
    setIsLoading(true);

    const signInResult = await signInTyped("email", {
      email: data.email.toLowerCase(),
      redirect: false,
      callbackUrl: searchParams?.get("from") ?? `/${lang}/dashboard`,
    }).catch((error) => {
      console.error("Error during sign in:", error);
    });

    setIsLoading(false);

    if (!signInResult?.ok) {
      return toastTyped({
        title: "Something went wrong.",
        description: "Your sign in request failed. Please try again.",
        variant: "destructive",
      });
    }

    return toastTyped({
      title: "Check your email",
      description: "We sent you a login link. Be sure to check your spam too.",
    });
  }

  return (
    <div className={cnTyped("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading || isGitHubLoading || disabled}
              {...register("email")}
            />
            {errors?.email && (
              <p className="px-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
          <button className={cnTyped(buttonVariantsTyped())} disabled={isLoading}>
            {isLoading && (
              <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {dict.signin_email}
            {/* Sign In with Email */}
          </button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {dict.signin_others}
            {/* Or continue with */}
          </span>
        </div>
      </div>
      <button
        type="button"
        className={cnTyped(buttonVariantsTyped({ variant: "outline" }))}
        onClick={() => {
          setIsGitHubLoading(true);
          signInTyped("github").catch((error) => {
            console.error("GitHub signIn error:", error);
          });
        }}
        disabled={isLoading || isGitHubLoading}
      >
        {isGitHubLoading ? (
          <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.GitHub className="mr-2 h-4 w-4" />
        )}{" "}
        Github
      </button>
    </div>
  );
}
