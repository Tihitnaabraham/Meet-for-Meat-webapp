
import { NextRequest, NextResponse } from "next/server";

const baseUrl =
  process.env.BASE_URL || "https://meet-for-meat-backend.onrender.com";

export async function POST(req: NextRequest) {
  console.log("API /api/pay POST handler triggered");

  try {
    const body = await req.json();
    console.log("Request body:", body);

    const joinRes = await fetch(`${baseUrl}/kirchagroups/groups/join/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        group: body.groupId,
        member_full_name: body.fullName,
        member_phone_number: body.phoneNumber,
        member_delivery_address: body.deliveryAddress,
        payment_status: "pending"
      }),
    });

    const joinText = await joinRes.text();
    if (!joinRes.ok || !joinText) {
      console.error("Join API error:", joinText);
      return NextResponse.json({ error: joinText || "Join API failure" }, { status: joinRes.status });
    }

    let joinData;
    try {
      joinData = JSON.parse(joinText);
    } catch {
      console.error("Join API returned invalid JSON");
      return NextResponse.json({ error: "Join API invalid JSON" }, { status: 502 });
    }

    const paymentRes = await fetch(`${baseUrl}/mpesa/lipa-na-mpesa-online/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: body.phoneNumber,
        amount: body.amount,
        reference: `Group${body.groupId}_${joinData.id || ""}`,
        description: "Meet for Meat group payment",
        group: body.groupId,
        join_id: joinData.id,
      }),
    });

    const paymentText = await paymentRes.text();
    if (!paymentRes.ok || !paymentText) {
      console.error("Payment API error:", paymentText);
      return NextResponse.json({ error: paymentText || "Payment API failure" }, { status: paymentRes.status });
    }

    let paymentData;
    try {
      paymentData = JSON.parse(paymentText);
    } catch {
      console.error("Payment API returned invalid JSON");
      return NextResponse.json({ error: "Payment API invalid JSON" }, { status: 502 });
    }

    return NextResponse.json({ joinData, paymentData }, { status: 200 });

  } catch (error: unknown) {
    console.error("Unhandled API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
