
const baseUrl = process.env.BASE_URL || "https://meet-for-meat-backend.onrender.com";

export async function fetchSignin(phone_number: string, password: string) {
  try {
    const response = await fetch(`${baseUrl}/users/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone_number, password }),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.detail || "Signin failed");
    }

    const result = await response.json();

    if (result.token && result.user_id) {
      localStorage.setItem("token", result.token);
      localStorage.setItem("user_id", result.user_id);
    } else {
      throw new Error("No token or user_id received from server.");
    }

    return result;
  } catch (error) {
    throw new Error("Failed to signin: " + (error as Error).message);
  }
}
