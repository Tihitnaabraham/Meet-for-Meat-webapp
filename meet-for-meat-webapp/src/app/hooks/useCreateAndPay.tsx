"use client";

import { useState } from "react";
import { postCreateAndPay } from "../utils/fetchCreateAndPay";

interface CreatePayParams {
  groupId: number;
  fullName: string;
  phoneNumber: string;
  deliveryAddress: string;
  amount: number;
}

export function useCreateAndPay() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  async function createAndPay(data: CreatePayParams) {
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await postCreateAndPay(data);
      setSuccessMsg("Payment initiated! Please complete payment on your phone.");
    } catch (error) {
      setErrorMsg((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return { loading, errorMsg, successMsg, createAndPay };
}
