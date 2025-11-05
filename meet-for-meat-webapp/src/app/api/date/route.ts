import { NextRequest, NextResponse } from "next/server";

const baseUrl = process.env.BASE_URL || "https://meet-for-meat-backend.onrender.com";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch(`${baseUrl}/kirchagroups/groups/create/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await response.text();

    if (!response.ok) {
      return NextResponse.json({ error: text || "Group creation failed" }, { status: response.status });
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json({ error: "Invalid JSON from backend" }, { status: 502 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
