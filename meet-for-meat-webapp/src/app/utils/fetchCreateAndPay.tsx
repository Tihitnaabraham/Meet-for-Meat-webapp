const baseUrl = process.env.BASE_URL || "https://meet-for-meat-backend.onrender.com";

export async function postCreateAndPay(data: {
  groupId: number;
  fullName: string;
  phoneNumber: string; 
  deliveryAddress: string;
  amount: number;
}) {
  if (typeof window === "undefined") {
    throw new Error("LocalStorage is not available");
  }

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("user_id");

  if (!token) throw new Error("Authentication token is missing");
  if (!userId) throw new Error("User ID is missing");

  const requestBody = {
    user: parseInt(userId),
    member_full_name: data.fullName,
    member_phone_number: data.phoneNumber,
    member_delivery_address: data.deliveryAddress,
    payment_status: "pending",
    group: data.groupId,
  };

  const joinRes = await fetch(`${baseUrl}/kirchagroups/groups/join/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(requestBody),
  });

  const joinText = await joinRes.text();
  if (!joinRes.ok) {
    throw new Error(joinText || "Failed to join group");
  }

  let joinData;
  try {
    joinData = JSON.parse(joinText);
  } catch {
    throw new Error("Invalid JSON response from join API");
  }

  const paymentRequestBody = {
    phone: data.phoneNumber,
    amount: data.amount,
    reference: `Group${data.groupId}_${joinData.id || ""}`,
    description: "Meet for Meat group payment",
    group: data.groupId,
    join_id: joinData.id,
  };

  const paymentRes = await fetch(`${baseUrl}/mpesa/lipa-na-mpesa-online/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(paymentRequestBody),
  });

  const paymentText = await paymentRes.text();
  if (!paymentRes.ok) {
    throw new Error(paymentText || "Failed to initiate payment");
  }

  let paymentData;
  try {
    paymentData = JSON.parse(paymentText);
  } catch {
    throw new Error("Invalid JSON response from payment API");
  }

  return { joinData, paymentData };
}
