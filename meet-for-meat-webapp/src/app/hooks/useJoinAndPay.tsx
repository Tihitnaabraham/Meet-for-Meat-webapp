import { useState } from "react";
import { postJoinAndPay } from "../utils/fetchJoinAndPay";

interface JoinPayParams {
  groupId: number;
  fullName: string;
  phoneNumber: string;
  deliveryAddress: string;
  amount: number;
}

export function useJoinAndPay() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  async function joinAndPay(data: JoinPayParams) {
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await postJoinAndPay(data);
      setSuccessMsg("Payment initiated! Please complete payment on your phone.");
    } catch (error) {
      setErrorMsg((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return { loading, errorMsg, successMsg, joinAndPay };
}
