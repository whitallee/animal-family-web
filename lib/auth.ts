import { useMutation } from "@tanstack/react-query";

interface LoginResponse {
  token: string;
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const data = await response.json();
  
  // Store the token in localStorage
  if (data.token) {
    localStorage.setItem('auth_token', data.token);
  }

  return data;
}

export function useLogin() {
  return useMutation<LoginResponse, Error, { email: string; password: string }>({
    mutationFn: ({ email, password }) => loginUser(email, password),
  });
} 