import { useMutation } from "@tanstack/react-query";
import { loginUser as loginRequest, registerUser } from "@/lib/api/generated/users/users";
import type { AuthResponse } from "@/lib/api/generated/model";
import { unwrap } from "./api/unwrap";

const AUTH_TOKEN_KEY = "auth_token";

/**
 * Login and registration over the generated v2 client.
 *
 * The token is stored here on success because AuthContext reads it back from
 * localStorage on mount to restore the session.
 */

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const auth = unwrap<AuthResponse>(await loginRequest({ email, password }));

  window.localStorage.setItem(AUTH_TOKEN_KEY, auth.token);

  return auth;
}

export function useLogin() {
  return useMutation<AuthResponse, Error, { email: string; password: string }>({
    mutationFn: ({ email, password }) => loginUser(email, password),
  });
}

interface RegisterUserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export function useRegister() {
  return useMutation<void, Error, RegisterUserInput>({
    mutationFn: async (payload) => {
      await registerUser(payload);
    },
  });
}
