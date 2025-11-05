const baseUrl = process.env.BASE_URL || "https://meet-for-meat-backend.onrender.com";

export async function postJoinAndPay(data: {
  groupId: number;
  fullName: string;
  phoneNumber: string;
  deliveryAddress: string;
  amount: number;
}) {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("user_id");
  console.log("postJoinAndPay - Retrieved from localStorage:", {
    token: token ? `${token.slice(0, 10)}...` : null,
    user_id: userId,
  });

  if (!token) {
    console.error("postJoinAndPay - No token found in localStorage");
    throw new Error("Authentication token is missing");
  }
  if (!userId) {
    console.error("postJoinAndPay - No user_id found in localStorage");
    throw new Error("User ID is missing");
  }

  const requestBody = {
    user: parseInt(userId),
    group: data.groupId,
    member_full_name: data.fullName,
    member_phone_number: data.phoneNumber,
    member_delivery_address: data.deliveryAddress,
    payment_status: "pending",
  };
  console.log("postJoinAndPay - Sending join group request with data:", requestBody);
  console.log("postJoinAndPay - Authorization header:", `Token ${token.slice(0, 10)}...`);

  const joinRes = await fetch(`${baseUrl}/kirchagroups/groups/join/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`, 
    },
    body: JSON.stringify(requestBody),
  });

  const joinText = await joinRes.text();
  console.log("postJoinAndPay - Join group API response status:", joinRes.status, "text:", joinText);

  if (!joinRes.ok) {
    console.error("postJoinAndPay - Join group API error:", joinText);
    throw new Error(joinText || "Failed to join group");
  }

  let joinData;
  try {
    joinData = JSON.parse(joinText);
    console.log("postJoinAndPay - Join group API parsed response:", joinData);
  } catch {
    console.error("postJoinAndPay - Invalid JSON response from join API:", joinText);
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
  console.log("postJoinAndPay - Sending payment request with data:", paymentRequestBody);

  const paymentRes = await fetch(`${baseUrl}/mpesa/lipa-na-mpesa-online/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(paymentRequestBody),
  });

  const paymentText = await paymentRes.text();
  console.log("postJoinAndPay - Payment API response status:", paymentRes.status, "text:", paymentText);

  if (!paymentRes.ok) {
    console.error("postJoinAndPay - Payment API error:", paymentText);
    throw new Error(paymentText || "Failed to initiate payment");
  }

  let paymentData;
  try {
    paymentData = JSON.parse(paymentText);
    console.log("postJoinAndPay - Payment API parsed response:", paymentData);
  } catch {
    console.error("postJoinAndPay - Invalid JSON response from payment API:", paymentText);
    throw new Error("Invalid JSON response from payment API");
  }

  return { joinData, paymentData };
}