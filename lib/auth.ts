import { useMutation } from "@tanstack/react-query";
import { User } from "@/types/db-types";

interface LoginResponse {
  token: string;
  user: User;
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/user/login`;
  console.log('Attempting to fetch from:', url);
  console.log('API Base URL:', process.env.NEXT_PUBLIC_API_BASE_URL);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    localStorage.setItem("auth_token", data.token);
    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error(`Failed to connect to API at ${url}. Check if the backend is running and CORS is configured.`);
    }
    throw error;
  }
}

export function useLogin() {
  return useMutation<LoginResponse, Error, { email: string; password: string }>({
    mutationFn: ({ email, password }) => loginUser(email, password),
  });
}

interface RegisterUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  success: boolean;
}

export async function registerUser(
  firstName: string,
  lastName: string,
  email: string,
  password: string
): Promise<RegisterResponse> {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/user/register`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create account');
    }

    return { success: true };
  } catch (error) {
    console.error('Error creating account:', error);
    throw error;
  }
}

export function useRegister() {
  return useMutation<RegisterResponse, Error, RegisterUserPayload>({
    mutationFn: ({ firstName, lastName, email, password }) =>
      registerUser(firstName, lastName, email, password),
  });
} 