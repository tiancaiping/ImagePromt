"use client";

import { useTransition } from "react";

import { Button } from "@saasfly/ui/button";
import * as Icons from "@saasfly/ui/icons";

import { trpc } from "~/trpc/client";
import type { SubscriptionPlan, UserSubscriptionPlan } from "~/types";

interface BillingFormButtonProps {
  offer: SubscriptionPlan;
  subscriptionPlan: UserSubscriptionPlan;
  year: boolean;
  dict: Record<string, string>;
}

export function BillingFormButton({
  year,
  offer,
  dict,
  subscriptionPlan,
}: BillingFormButtonProps) {
  const [isPending, startTransition] = useTransition();
  const trpcClient = trpc as unknown as {
    stripe: {
      createSession: {
        mutate: (input: { planId: string }) => Promise<{ url?: string }>;
      };
    };
  };

  async function createSession(planId: string) {
    const res = await trpcClient.stripe.createSession.mutate({ planId: planId });
    if (res?.url) window.location.href = res?.url;
  }

  const stripePlanId = year
    ? offer?.stripeIds?.yearly
    : offer?.stripeIds?.monthly;

  const stripeSessionAction = () =>
    startTransition(async () => await createSession(stripePlanId!));

  return (
    <Button
      variant="default"
      className="w-full"
      disabled={isPending}
      onClick={stripeSessionAction}
    >
      {isPending ? (
        <>
          <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" /> Loading...
        </>
      ) : (
        <>
          {subscriptionPlan.stripePriceId
            ? dict.manage_subscription
            : dict.upgrade}
        </>
      )}
    </Button>
  );
}
