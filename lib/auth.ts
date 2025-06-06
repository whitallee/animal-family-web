import { useMutation } from "@tanstack/react-query";
import { User } from "@/types/db-types";

interface LoginResponse {
  token: string;
  user: User;
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/user/login`, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'Origin': 'http://localhost:3000',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const data = await response.json();
  localStorage.setItem("auth_token", data.token);
  return data;
}

export function useLogin() {
  return useMutation<LoginResponse, Error, { email: string; password: string }>({
    mutationFn: ({ email, password }) => loginUser(email, password),
  });
} 