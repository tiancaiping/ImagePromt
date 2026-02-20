"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import type { User } from "@saasfly/auth";
import { useForm, type Resolver, type UseFormProps, type UseFormReturn } from "react-hook-form";
import type { ZodTypeAny } from "zod";
import type * as z from "zod";

import { cn } from "@saasfly/ui";
import { buttonVariants } from "@saasfly/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@saasfly/ui/card";
import * as Icons from "@saasfly/ui/icons";
import { Input } from "@saasfly/ui/input";
import { Label } from "@saasfly/ui/label";
import { toast } from "@saasfly/ui/use-toast";

import { userNameSchema } from "~/lib/validations/user";
import { trpc, type RouterInputs, type RouterOutputs } from "~/trpc/client";

interface UserNameFormProps extends React.HTMLAttributes<HTMLFormElement> {
  user: Pick<User, "id" | "name">;
}

type FormData = z.infer<typeof userNameSchema>;
type UpdateUserNameInput = RouterInputs["customer"]["updateUserName"];
type UpdateUserNameOutput = RouterOutputs["customer"]["updateUserName"];

export function UserNameForm({ user, className, ...props }: UserNameFormProps) {
  const router = useRouter();
  const useFormTyped = useForm as unknown as <T>(
    props: UseFormProps<T>,
  ) => UseFormReturn<T>;
  const zodResolverTyped = zodResolver as unknown as <
    TSchema extends ZodTypeAny,
  >(
    schema: TSchema,
  ) => Resolver<z.infer<TSchema>>;
  const cnTyped = cn as unknown as (...inputs: unknown[]) => string;
  const buttonVariantsTyped = buttonVariants as unknown as (props?: {
    variant?: string;
  }) => string;
  const toastTyped = toast as unknown as (props: {
    title?: string;
    description?: string;
    variant?: string;
  }) => void;
  const trpcClient = trpc as unknown as {
    customer: {
      updateUserName: {
        mutate: (input: UpdateUserNameInput) => Promise<UpdateUserNameOutput>;
      };
    };
  };
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useFormTyped<FormData>({
    resolver: zodResolverTyped(userNameSchema),
    defaultValues: {
      name: user?.name ?? "",
    },
  });
  const [isSaving, setIsSaving] = React.useState<boolean>(false);

  async function onSubmit(data: FormData) {
    setIsSaving(true);

    const updateUserName = trpcClient.customer.updateUserName.mutate;
    const response = await updateUserName({
      name: data.name,
      userId: user.id,
    });
    setIsSaving(false);

    if (!response?.success) {
      return toastTyped({
        title: "Something went wrong.",
        description: "Your name was not updated. Please try again.",
        variant: "destructive",
      });
    }

    toastTyped({
      description: "Your name has been updated.",
    });

    router.refresh();
  }

  return (
    <form
      className={cnTyped(className)}
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle>Your Name</CardTitle>
          <CardDescription>
            Please enter your full name or a display name you are comfortable
            with.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="name">
              Name
            </Label>
            <Input
              id="name"
              className="w-[400px]"
              size={32}
              {...register("name")}
            />
            {errors?.name && (
              <p className="px-1 text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <button
            type="submit"
            className={cnTyped(buttonVariantsTyped(), className)}
            disabled={isSaving}
          >
            {isSaving && (
              <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            <span>Save</span>
          </button>
        </CardFooter>
      </Card>
    </form>
  );
}
