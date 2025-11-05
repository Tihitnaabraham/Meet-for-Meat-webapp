const baseUrl = process.env.BASE_URL || "https://meet-for-meat-backend.onrender.com";
export async function createInvitation(groupId: number) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("createInvitation: No token found in localStorage");
    throw new Error("Authentication token is missing");
  }

  const payload = { group: groupId };
  console.log("createInvitation: Sending payload:", payload);

  const response = await fetch(`${baseUrl}/kirchagroups/groups/invite/`, {
    method: "POST",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`createInvitation: Failed with status ${response.status}, response:`, errorText);
    throw new Error(`Failed to create invitation: ${errorText || response.status}`);
  }

  const data = await response.json();
  console.log("createInvitation: Success response:", data);
  return data;
}

export async function fetchInvitationDetails(inviteCode: string) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("fetchInvitationDetails: No token found in localStorage");
    throw new Error("Authentication token is missing");
  }

  console.log("fetchInvitationDetails: Fetching invite code:", inviteCode);

  const response = await fetch(`${baseUrl}/kirchagroups/groups/invite/${inviteCode}/`, {
    method: "GET",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`fetchInvitationDetails: Failed with status ${response.status}, response:`, errorText);
    throw new Error(`Failed to fetch invitation details: ${errorText || response.status}`);
  }

  const data = await response.json();
  console.log("fetchInvitationDetails: Success response:", data);
  return data;
}

export async function postJoin(joinData: {
  member_full_name: string;
  member_phone_number: string;
  member_delivery_address: string;
  payment_status: string;
  group: number;
}) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("postJoin: No token found in localStorage");
    throw new Error("Authentication token is missing");
  }

  console.log("postJoin: Sending payload:", joinData);

  const response = await fetch(`${baseUrl}/kirchagroups/groups/join/`, {
    method: "POST",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(joinData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`postJoin: Failed with status ${response.status}, response:`, errorText);
    throw new Error(`Failed to join group: ${errorText || response.status}`);
  }

  const data = await response.json();
  console.log("postJoin: Success response:", data);
  return data;
}