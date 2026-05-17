import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  risk_score: number;
  is_suspicious: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (username, password) => {
        set({ isLoading: true });
        try {
          const { data } = await axios.post(`${API}/api/auth/token`, { username, password });
          set({ token: data.access_token, isAuthenticated: true, isLoading: false });
          await get().fetchMe();
        } catch (err: any) {
          set({ isLoading: false });
          throw new Error(err.response?.data?.detail || "Login failed");
        }
      },

      register: async (username, email, password) => {
        set({ isLoading: true });
        try {
          await axios.post(`${API}/api/auth/register`, { username, email, password });
          set({ isLoading: false });
        } catch (err: any) {
          set({ isLoading: false });
          throw new Error(err.response?.data?.detail || "Registration failed");
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },

      fetchMe: async () => {
        const { token } = get();
        if (!token) return;
        try {
          const { data } = await axios.get(`${API}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          set({ user: data });
        } catch {
          set({ user: null, token: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: "sentinel-auth",
      partialize: (state) => ({ token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);
