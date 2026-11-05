"use client";

import { createTransferRequest } from "@lib/data/orders";
import { CheckCircleMiniSolid, XCircleSolid } from "@medusajs/icons";
import {
  Text,
  Heading,
  Input,
  Button,
  IconButton,
  Toaster,
} from "@medusajs/ui";
import { SubmitButton } from "@modules/checkout/components/submit-button";
import { useActionState, useEffect, useState } from "react";

export default function TransferRequestForm() {
  const [showSuccess, setShowSuccess] = useState(false);

  const [state, formAction] = useActionState(createTransferRequest, {
    error: null,
    order: null,
    success: false,
  });

  useEffect(() => {
    if (state.success && state.order) {
      setShowSuccess(true);
    }
  }, [state.success, state.order]);

  return (
    <div className="flex w-full flex-col gap-y-4">
      <div className="grid w-full items-center gap-x-8 gap-y-4 sm:grid-cols-2">
        <div className="flex flex-col gap-y-1">
          <Heading level="h3" className="text-lg text-neutral-950">
            Order transfers
          </Heading>
          <Text className="text-base-regular text-neutral-500">
            Can&apos;t find the order you are looking for?
            <br /> Connect an order to your account.
          </Text>
        </div>
        <form
          action={formAction}
          className="flex flex-col gap-y-1 sm:items-end"
        >
          <div className="flex w-full flex-col gap-y-2">
            <Input className="w-full" name="order_id" placeholder="Order ID" />
            <SubmitButton
              variant="secondary"
              className="w-fit self-end whitespace-nowrap"
            >
              Request transfer
            </SubmitButton>
          </div>
        </form>
      </div>
      {!state.success && state.error && (
        <Text className="text-base-regular text-right text-rose-500">
          {state.error}
        </Text>
      )}
      {showSuccess && (
        <div className="shadow-borders-base flex w-full items-center justify-between self-stretch bg-neutral-50 p-4">
          <div className="flex items-center gap-x-2">
            <CheckCircleMiniSolid className="h-4 w-4 text-emerald-500" />
            <div className="flex flex-col gap-y-1">
              <Text className="text-medim-pl text-neutral-950">
                Transfer for order {state.order?.id} requested
              </Text>
              <Text className="text-base-regular text-neutral-600">
                Transfer request email sent to {state.order?.email}
              </Text>
            </div>
          </div>
          <IconButton
            variant="transparent"
            className="h-fit"
            onClick={() => setShowSuccess(false)}
          >
            <XCircleSolid className="h-4 w-4 text-neutral-500" />
          </IconButton>
        </div>
      )}
    </div>
  );
}
