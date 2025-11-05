// const baseUrl = process.env.BASE_URL || "https://meet-for-meat-backend.onrender.com";

// export async function fetchJoinedGroups(token: string, userId: string) {
//   if (!token || !userId) throw new Error("Authentication required");
//   const joinsRes = await fetch(`${baseUrl}/kirchagroups/groups/join/?user=${userId}`, {
//     headers: { 
//       Authorization: `Token ${token}`,
//     },
//     cache: 'no-store', 
//   });

//   if (!joinsRes.ok) {
//     const errorBody = await joinsRes.text();
//     throw new Error(`Failed to fetch user joins: ${joinsRes.status} ${joinsRes.statusText}. ${errorBody}`);
//   }

//   const joins = await joinsRes.json();
//   if (!joins || joins.length === 0) {
//     return []; 
//   }

//   const joinedGroupIds = joins.map((join: any) => join.group);

//   const groupsRes = await fetch(`${baseUrl}/kirchagroups/groups/create/`, {
//     headers: { Authorization: `Token ${token}` },
//     cache: 'no-store',
//   });
//   if (!groupsRes.ok) {
//     throw new Error(`Failed to fetch groups: ${groupsRes.statusText}`);
//   }
//   const allGroups = await groupsRes.json();
//   const filteredGroups = allGroups.filter((group: any) =>
//     joinedGroupIds.includes(group.id)
//   );

//   return filteredGroups;
// }
const baseUrl = process.env.BASE_URL || "https://meet-for-meat-backend.onrender.com";

// Define interfaces for the data structures you expect from your API
interface Join {
  group: number | string;
  [key: string]: unknown; // Allows for other properties without strict typing
}

interface Group {
  id: number | string;
  [key: string]: unknown;
}

export async function fetchJoinedGroups(token: string, userId: string) {
  if (!token || !userId) throw new Error("Authentication required");
  const joinsRes = await fetch(`${baseUrl}/kirchagroups/groups/join/?user=${userId}`, {
    headers: { 
      Authorization: `Token ${token}`,
    },
    cache: 'no-store', 
  });

  if (!joinsRes.ok) {
    const errorBody = await joinsRes.text();
    throw new Error(`Failed to fetch user joins: ${joinsRes.status} ${joinsRes.statusText}. ${errorBody}`);
  }

  const joins = await joinsRes.json();
  if (!joins || joins.length === 0) {
    return []; 
  }

  // Replaced 'any' with the specific 'Join' interface
  const joinedGroupIds = joins.map((join: Join) => join.group);

  const groupsRes = await fetch(`${baseUrl}/kirchagroups/groups/create/`, {
    headers: { Authorization: `Token ${token}` },
    cache: 'no-store',
  });
  if (!groupsRes.ok) {
    throw new Error(`Failed to fetch groups: ${groupsRes.statusText}`);
  }
  const allGroups = await groupsRes.json();
  // Replaced 'any' with the specific 'Group' interface
  const filteredGroups = allGroups.filter((group: Group) =>
    joinedGroupIds.includes(group.id)
  );

  return filteredGroups;
}