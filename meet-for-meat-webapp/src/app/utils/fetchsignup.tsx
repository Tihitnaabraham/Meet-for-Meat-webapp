const baseUrl = process.env.BASE_URL || "https://meet-for-meat-backend.onrender.com";

export type SignupData = {
  full_name: string;
  phone_number: string;
  user_type: string;
  email: string;
  password: string;
};

export async function fetchSignup(data: SignupData) {
  const res = await fetch(`${baseUrl}/users/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.detail || errData.error || "Signup failed");
  }

  return res.json();
}

export async function fetchLogin(phone_number: string, password: string) {
  const res = await fetch(`${baseUrl}/users/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone_number, password }),
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.detail || errData.error || "Login failed");
  }

  return res.json();
}
