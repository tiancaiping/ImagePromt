"use client";

import Link from "next/link";

import { cn } from "@saasfly/ui";
import { buttonVariants } from "@saasfly/ui/button";

export function SubscriptionForm(props: {
  hasSubscription: boolean;
  dict: Record<string, string>;
}) {
  const cnTyped = cn as unknown as (...inputs: unknown[]) => string;
  const buttonVariantsTyped = buttonVariants as unknown as (props?: {
    variant?: string;
  }) => string;
  return (
    <Link href="/pricing" className={cnTyped(buttonVariantsTyped())}>
      {props.hasSubscription
        ? props.dict.manage_subscription
        : props.dict.upgrade}
    </Link>
  );
}
