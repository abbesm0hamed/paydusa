"use client";

import { updateCustomer } from "@lib/data/customer";
import type { HttpTypes } from "@medusajs/types";
import Input from "@modules/common/components/input";
import React, { useEffect, useActionState } from "react";

import AccountInfo from "../account-info";

interface MyInformationProps {
  customer: HttpTypes.StoreCustomer;
}

const ProfileEmail: React.FC<MyInformationProps> = ({ customer }) => {
  const [successState, setSuccessState] = React.useState(false);

  const updateCustomerPhone = async (
    _currentState: Record<string, unknown>,
    formData: FormData
  ) => {
    const customer = {
      phone: formData.get("phone") as string,
    };

    try {
      await updateCustomer(customer);
      return { error: null, success: true };
    } catch (error: any) {
      return { error: error.toString(), success: false };
    }
  };

  const [state, formAction] = useActionState(updateCustomerPhone, {
    error: false,
    success: false,
  });

  const clearState = () => {
    setSuccessState(false);
  };

  useEffect(() => {
    setSuccessState(state.success);
  }, [state]);

  return (
    <form action={formAction} className="w-full">
      <AccountInfo
        label="Phone"
        currentInfo={`${customer.phone}`}
        isSuccess={successState}
        isError={!!state.error}
        errorMessage={state.error}
        clearState={clearState}
        data-testid="account-phone-editor"
      >
        <div className="grid grid-cols-1 gap-y-2">
          <Input
            label="Phone"
            name="phone"
            type="phone"
            autoComplete="phone"
            required
            defaultValue={customer.phone ?? ""}
            data-testid="phone-input"
          />
        </div>
      </AccountInfo>
    </form>
  );
};

export default ProfileEmail;
