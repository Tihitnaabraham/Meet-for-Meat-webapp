const baseUrl = process.env.BASE_URL || "https://meet-for-meat-backend.onrender.com";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const response = await fetch(`${baseUrl}/users/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.detail || errData.error || "Signup failed");
    }

    const result = await response.json();

    return new Response(JSON.stringify(result), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response((error as Error).message, {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
