import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("user");
  const groupId = url.searchParams.get("group");

  if (!userId || !groupId) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const baseApiUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://meet-for-meat-backend.onrender.com";
  const token = req.headers.get("Authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Authentication token is missing" }, { status: 401 });
  }

  try {
    const joinsRes = await fetch(`${baseApiUrl}/kirchagroups/groups/join/?user=${userId}&group=${groupId}`, {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    });
    const joinsText = await joinsRes.text();
    if (!joinsRes.ok) {
      console.error("route.ts - Failed to fetch join details:", joinsRes.status, joinsText);
      return NextResponse.json({ error: `Failed to fetch join details: ${joinsText || joinsRes.status}` }, { status: joinsRes.status });
    }
    let joins;
    try {
      joins = JSON.parse(joinsText);
    } catch {
      console.error("route.ts - Invalid JSON response from joins API:", joinsText);
      return NextResponse.json({ error: "Invalid JSON response from joins API" }, { status: 502 });
    }

    if (joins.length === 0) {
      return NextResponse.json({ error: "No join record found for this user and group" }, { status: 404 });
    }

    const join = joins[0];
    const groupIdFromJoin = join.group;
    const groupsRes = await fetch(`${baseApiUrl}/kirchagroups/groups/create/`, {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    });
    const groupsText = await groupsRes.text();
    if (!groupsRes.ok) {
      console.error("route.ts - Failed to fetch groups:", groupsRes.status, groupsText);
      return NextResponse.json({ error: `Failed to fetch group details: ${groupsText || groupsRes.status}` }, { status: groupsRes.status });
    }
    let allGroups;
    try {
      allGroups = JSON.parse(groupsText);
    } catch {
      console.error("route.ts - Invalid JSON response from groups API:", groupsText);
      return NextResponse.json({ error: "Invalid JSON response from groups API" }, { status: 502 });
    }

    const group = Array.isArray(allGroups) ? allGroups.find(g => g.id === groupIdFromJoin) : null;
    if (!group) {
      console.error("route.ts - Group not found for ID:", groupIdFromJoin);
      return NextResponse.json({ error: `Group ${groupIdFromJoin} not found` }, { status: 404 });
    }
    const livestockRes = await fetch(`${baseApiUrl}/livestock/livestock/${group.livestock}/`, {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    });
    const livestockText = await livestockRes.text();
    if (!livestockRes.ok) {
      console.error("route.ts - Failed to fetch livestock", group.livestock, ":", livestockRes.status, livestockText);
      return NextResponse.json({ error: `Failed to fetch livestock details: ${livestockText || livestockRes.status}` }, { status: livestockRes.status });
    }
    let livestock;
    try {
      livestock = JSON.parse(livestockText);
    } catch {
      console.error("route.ts - Invalid JSON response from livestock API:", livestockText);
      return NextResponse.json({ error: "Invalid JSON response from livestock API" }, { status: 502 });
    }
    const paymentRes = await fetch(`${baseApiUrl}/mpesa/payments/?payer=${userId}&group=${groupId}`, {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    });
    const paymentText = await paymentRes.text();
    let payment = {};
    if (paymentRes.ok) {
      try {
        const payments = JSON.parse(paymentText);
        payment = payments[0] || {};
      } catch {
        console.warn("route.ts - Invalid JSON response from payment API:", paymentText);
      }
    } else {
      console.warn("route.ts - Failed to fetch payment details:", paymentRes.status, paymentText);
    }

    return NextResponse.json({
      group,
      livestock,
      payment,
    }, { status: 200 });
  } catch (error: unknown) {
    console.error("route.ts - Unhandled error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}