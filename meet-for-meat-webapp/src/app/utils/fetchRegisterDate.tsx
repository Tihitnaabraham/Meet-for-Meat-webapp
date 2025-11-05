
const baseUrl = process.env.BASE_URL || "https://meet-for-meat-backend.onrender.com";

export async function registerGroup(data: object) {
  const response = await fetch(`${baseUrl}/kirchagroups/groups/create/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to create group");
  }

  return await response.json();
}
