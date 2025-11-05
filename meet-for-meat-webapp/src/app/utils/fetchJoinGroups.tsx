// const baseUrl = process.env.BASE_URL || "https://meet-for-meat-backend.onrender.com";

// export async function fetchJoinGroups(page = 1, pageSize = 3) {
//   const token = localStorage.getItem("token");
//   if (!token) throw new Error("Unauthorized: No token found.");

//   const headers = {
//     "Content-Type": "application/json",
//     Authorization: `Token ${token}`,
//   };

//   const groupsResponse = await fetch(
//     `${baseUrl}/kirchagroups/groups/create/?page=${page}&page_size=${pageSize}&public=true`,
//     { headers }
//   );
//   if (!groupsResponse.ok) {
//     const errorText = await groupsResponse.text();
//     throw new Error(`Groups API error: ${errorText || groupsResponse.statusText}`);
//   }
  
//   const groupsData = await groupsResponse.json();
//   const groups = groupsData.results ?? groupsData;
//   const totalGroups = groupsData.count ?? groups.length;

//   const animalsResponse = await fetch(`${baseUrl}/livestock/livestock/`, { headers });
//   if (!animalsResponse.ok) throw new Error("Animals API error");
//   const animals = await animalsResponse.json();

//   const joinsResponse = await fetch(`${baseUrl}/kirchagroups/groups/join/`, { headers });
//   if (!joinsResponse.ok) throw new Error("Joins API error");
//   const joins = await joinsResponse.json();

//   const paymentsResponse = await fetch(`${baseUrl}/mpesa/payments/`, { headers });
//   if (!paymentsResponse.ok) throw new Error("Payments API error");
//   const payments = await paymentsResponse.json();

//   const processedGroups = groups.map((group: any) => {
//     const groupJoins = joins.filter((join: any) => join.group === group.id);
//     const joinedCount = groupJoins.length;
//     const paidCount = payments.filter(
//       (payment: any) => payment.group === group.id && payment.payment_status === "completed"
//     ).length;

//     const maxMembers = group.max_members;
//     const memberProgress = maxMembers > 0 ? (joinedCount / maxMembers) * 100 : 0;
//     const paymentProgress = maxMembers > 0 ? (paidCount / maxMembers) * 100 : 0;

//     return {
//       ...group,
//       current_members: joinedCount,
//       payment_progress: paymentProgress,
//       member_progress: memberProgress,
//     };
//   });

//   return { groups: processedGroups, animals, totalGroups };
// }
const baseUrl = process.env.BASE_URL || "https://meet-for-meat-backend.onrender.com";

// Define interfaces for the data structures you expect from your API
interface Group {
  id: number | string;
  max_members: number;
  [key: string]: unknown; // Allows for other properties without strict typing
}

interface Join {
  group: number | string;
  [key: string]: unknown;
}

interface Payment {
  group: number | string;
  payment_status: string;
  [key: string]: unknown;
}

export async function fetchJoinGroups(page = 1, pageSize = 3) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Unauthorized: No token found.");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Token ${token}`,
  };

  const groupsResponse = await fetch(
    `${baseUrl}/kirchagroups/groups/create/?page=${page}&page_size=${pageSize}&public=true`,
    { headers }
  );
  if (!groupsResponse.ok) {
    const errorText = await groupsResponse.text();
    throw new Error(`Groups API error: ${errorText || groupsResponse.statusText}`);
  }
  
  const groupsData = await groupsResponse.json();
  const groups = groupsData.results ?? groupsData;
  const totalGroups = groupsData.count ?? groups.length;

  const animalsResponse = await fetch(`${baseUrl}/livestock/livestock/`, { headers });
  if (!animalsResponse.ok) throw new Error("Animals API error");
  const animals = await animalsResponse.json();

  const joinsResponse = await fetch(`${baseUrl}/kirchagroups/groups/join/`, { headers });
  if (!joinsResponse.ok) throw new Error("Joins API error");
  const joins = await joinsResponse.json();

  const paymentsResponse = await fetch(`${baseUrl}/mpesa/payments/`, { headers });
  if (!paymentsResponse.ok) throw new Error("Payments API error");
  const payments = await paymentsResponse.json();
  const processedGroups = groups.map((group: Group) => {
    const groupJoins = joins.filter((join: Join) => join.group === group.id);
    const joinedCount = groupJoins.length;
    const paidCount = payments.filter(
      (payment: Payment) => payment.group === group.id && payment.payment_status === "completed"
    ).length;

    const maxMembers = group.max_members;
    const memberProgress = maxMembers > 0 ? (joinedCount / maxMembers) * 100 : 0;
    const paymentProgress = maxMembers > 0 ? (paidCount / maxMembers) * 100 : 0;

    return {
      ...group,
      current_members: joinedCount,
      payment_progress: paymentProgress,
      member_progress: memberProgress,
    };
  });

  return { groups: processedGroups, animals, totalGroups };
}