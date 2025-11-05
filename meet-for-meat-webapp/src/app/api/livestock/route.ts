const baseUrl = process.env.BASE_URL || "https://meet-for-meat-backend.onrender.com";

export async function GET() {
  try {
    const response = await fetch(`${baseUrl}/livestock/livestock/`);
    if (!response.ok) throw new Error(`Failed to fetch livestock: ${response.statusText}`);

    const result = await response.json();

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response((error as Error).message, {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}



