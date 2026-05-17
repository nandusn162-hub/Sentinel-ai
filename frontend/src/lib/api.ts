import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

export const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

// Inject token from localStorage
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("sentinel-auth");

    if (stored) {
      try {
        const { state } = JSON.parse(stored);

        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      } catch (error) {
        console.error("Token parse error:", error);
      }
    }
  }

  return config;
});

// =========================
// AUTH
// =========================
export const authApi = {
  register: (data: Record<string, unknown>) =>
    api.post("/auth/register", data),

  login: (data: Record<string, string>) =>
    api.post(
      "/auth/token",
      new URLSearchParams({
        username: data.username,
        password: data.password,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    ),
};

// =========================
// ANALYTICS
// =========================
export const analyticsApi = {
  getDashboard: () => api.get("/analytics/dashboard"),

  getFraudTimeline: () =>
    api.get("/analytics/fraud-timeline"),

  getThreatMap: () =>
    api.get("/analytics/threat-map"),
};

// =========================
// PRODUCTS
// =========================
export const productsApi = {
  list: () => api.get("/products/"),

  analyzeUrl: (url: string) =>
    api.post("/products/analyze", { url }),

  analyzeImage: (formData: FormData) =>
    api.post("/products/analyze-image", formData),

  getById: (id: number) =>
    api.get(`/products/${id}`),
};

// =========================
// REVIEWS
// =========================
export const reviewsApi = {
  getByProduct: (productId: number) =>
    api.get(`/reviews/${productId}`),

  submit: (data: Record<string, unknown>) =>
    api.post("/reviews/", data),

  getSuspicious: (params?: Record<string, unknown>) =>
    api.get("/detection/suspicious", { params }),
};

// =========================
// USERS
// =========================
export const usersApi = {
  getRisk: (userId: number) =>
    api.get(`/detection/user-risk/${userId}`),

  getAll: () => api.get("/admin/users"),

  update: (userId: number, data: Record<string, unknown>) =>
    api.put(`/admin/users/${userId}`, data),
};

// =========================
// ADMIN
// =========================
export const adminApi = {
  flagReview: (reviewId: number, reason: string) =>
    api.put(`/admin/flag/${reviewId}`, { reason }),

  unflagReview: (reviewId: number) =>
    api.put(`/admin/unflag/${reviewId}`),

  getDetectionLogs: () =>
    api.get("/admin/logs"),
};