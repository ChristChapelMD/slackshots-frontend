// Need to comibned with types exposed by better auth
import { authClient } from "@/lib/auth/client";

export interface SignInParams {
  email: string;
  password: string;
  callbackURL?: string;
  rememberMe?: boolean;
}

export interface SignUpParams extends SignInParams {
  name: string;
}

export interface AuthResult<T = any> {
  data: T | null; // Revisit this
  error: AuthError | null;
  success: boolean;
}

export interface AuthError extends Error {
  code?: string;
  message: string;
  status?: number;
  statusText?: string;
  field?: string;
}

export type AuthSession = typeof authClient.$Infer.Session;

export interface UseAuthReturn {
  loading: boolean;
  error: AuthError | null;
  session: AuthSession | null;
  sessionLoading: boolean;
  isAuthenticated: boolean;

  signUp: (params: SignUpParams) => Promise<AuthResult>;
  signIn: (params: SignInParams) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  getSession: () => Promise<AuthSession | null>;
  clearError: () => void;
}
