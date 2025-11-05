const baseUrl = process.env.BASE_URL;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const response = await fetch(`${baseUrl}/users/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errData = await response.json();
      return new Response(JSON.stringify({ detail: errData.detail || "Signin failed" }), {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const result = await response.json();
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response((error as Error).message || "Server error", {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
