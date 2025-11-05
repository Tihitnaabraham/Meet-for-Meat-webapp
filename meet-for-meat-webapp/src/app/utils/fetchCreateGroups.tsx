const baseUrl = process.env.BASE_URL || "https://meet-for-meat-backend.onrender.com";

export async function fetchLivestock() {
  const res = await fetch(`${baseUrl}/livestock/livestock/`);
  if (!res.ok) throw new Error("Failed to fetch livestock: " + res.statusText);
  return res.json();
}

export async function fetchGroups() {
  const res = await fetch(`${baseUrl}/kirchagroups/groups/create/`);
  if (!res.ok) throw new Error("Failed to fetch groups: " + res.statusText);
  return res.json();
}
