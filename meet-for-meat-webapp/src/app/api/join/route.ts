// import { NextResponse } from "next/server";

// const baseUrl = process.env.BASE_URL || "https://meet-for-meat-backend.onrender.com";

// export async function GET(req: Request) {
//   try {
//     const token = req.headers.get("Authorization")?.split(" ")[1];
//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
//     }

// const groupsResponse = await fetch(`${baseUrl}/kirchagroups/groups/create/`, {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Token ${token}`,
//       },
//     });
//     if (!groupsResponse.ok) {
//       const errorText = await groupsResponse.text();
//       throw new Error(`Failed to fetch groups: ${errorText || groupsResponse.statusText}`);
//     }
//     const groups = await groupsResponse.json();

//     const joinsResponse = await fetch(`${baseUrl}/kirchagroups/groups/join/`, {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Token ${token}`,
//       },
//     });
//     if (!joinsResponse.ok) {
//       const errorText = await joinsResponse.text();
//       throw new Error(`Failed to fetch joins: ${errorText || joinsResponse.statusText}`);
//     }
//     const joins = await joinsResponse.json();

//     const paymentsResponse = await fetch(`${baseUrl}/mpesa/payments/`, {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Token ${token}`,
//       },
//     });
//     if (!paymentsResponse.ok) {
//       const errorText = await paymentsResponse.text();
//       throw new Error(`Failed to fetch payments: ${errorText || paymentsResponse.statusText}`);
//     }
//     const payments = await paymentsResponse.json();

//     const processedGroups = groups.map((group: any) => {
//       const groupJoins = joins.filter((join: any) => join.group === group.id);
//       const joinedCount = groupJoins.length;
//       const paidCount = payments.filter(
//         (payment: any) => payment.group === group.id && payment.payment_status === "completed"
//       ).length;

//       const maxMembers = group.max_members;
//       const memberProgress = maxMembers > 0 ? (joinedCount / maxMembers) * 100 : 0;
//       const paymentProgress = maxMembers > 0 ? (paidCount / maxMembers) * 100 : 0;

//       return {
//         ...group,
//         current_members: joinedCount,
//         payment_progress: paymentProgress,
//         member_progress: memberProgress,
//       };
//     });

//     return NextResponse.json(processedGroups, {
//       status: 200,
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (error) {
//     console.error("route.ts - Error:", error);
//     return NextResponse.json(
//       { error: error instanceof Error ? error.message : "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
import { NextResponse } from "next/server";

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

const baseUrl = process.env.BASE_URL || "https://meet-for-meat-backend.onrender.com";

export async function GET(req: Request) {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
    }

    const groupsResponse = await fetch(`${baseUrl}/kirchagroups/groups/create/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });
    if (!groupsResponse.ok) {
      const errorText = await groupsResponse.text();
      throw new Error(`Failed to fetch groups: ${errorText || groupsResponse.statusText}`);
    }
    const groups = await groupsResponse.json();

    const joinsResponse = await fetch(`${baseUrl}/kirchagroups/groups/join/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });
    if (!joinsResponse.ok) {
      const errorText = await joinsResponse.text();
      throw new Error(`Failed to fetch joins: ${errorText || joinsResponse.statusText}`);
    }
    const joins = await joinsResponse.json();

    const paymentsResponse = await fetch(`${baseUrl}/mpesa/payments/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });
    if (!paymentsResponse.ok) {
      const errorText = await paymentsResponse.text();
      throw new Error(`Failed to fetch payments: ${errorText || paymentsResponse.statusText}`);
    }
    const payments = await paymentsResponse.json();

    // Replaced 'any' with the specific interfaces
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

    return NextResponse.json(processedGroups, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("route.ts - Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}