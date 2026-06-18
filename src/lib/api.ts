const API_URL = "https://fashion-hub-backend-13eb.onrender.com";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("admin_token");
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, { cache: "no-store", ...options, headers });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "API request failed");
  }

  return data as T;
}

async function adminRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  const token = getAdminToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, { cache: "no-store", ...options, headers });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "API request failed");
  }

  return data as T;
}

// File upload (admin only)
async function uploadFiles(files: File[]): Promise<{ files: { url: string; type: string; originalName: string }[] }> {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const token = getAdminToken();
  const response = await fetch(`${API_URL}/api/upload`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}

// ============================================
// AUTH API
// ============================================
export const authApi = {
  register: (data: any) =>
    request<any>("/api/auth/register", { method: "POST", body: JSON.stringify(data) }),
  verifyOtp: (email: string, otp: string) =>
    request<any>("/api/auth/verify-otp", { method: "POST", body: JSON.stringify({ email, otp }) }),
  resendOtp: (email: string) =>
    request<any>("/api/auth/resend-otp", { method: "POST", body: JSON.stringify({ email }) }),
  login: (email: string, password: string) =>
    request<any>("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  getProfile: () => request<any>("/api/auth/profile"),
  updateProfile: (data: any) =>
    request<any>("/api/auth/profile", { method: "PUT", body: JSON.stringify(data) }),
};

// ============================================
// PRODUCT API
// ============================================
export const productApi = {
  list: (params?: Record<string, string>) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<any>(`/api/products${query}`);
  },
  get: (id: string) => request<any>(`/api/products/${id}`),
  getReviews: (id: string) => request<any>(`/api/reviews/product/${id}`),
};

// ============================================
// SECTION API
// ============================================
export const sectionApi = {
  list: (params?: Record<string, string>) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<any>(`/api/sections${query}`);
  },
  get: (id: string) => request<any>(`/api/sections/${id}`),
};

// ============================================
// CART API
// ============================================
export const cartApi = {
  get: () => request<any>("/api/cart"),
  add: (productId: string, quantity: number = 1) =>
    request<any>("/api/cart", { method: "POST", body: JSON.stringify({ productId, quantity }) }),
  update: (id: string, quantity: number) =>
    request<any>(`/api/cart/${id}`, { method: "PUT", body: JSON.stringify({ quantity }) }),
  remove: (id: string) => request<any>(`/api/cart/${id}`, { method: "DELETE" }),
  clear: () => request<any>("/api/cart", { method: "DELETE" }),
};

// ============================================
// WISHLIST API
// ============================================
export const wishlistApi = {
  get: () => request<any>("/api/wishlist"),
  toggle: (productId: string) =>
    request<any>("/api/wishlist", { method: "POST", body: JSON.stringify({ productId }) }),
  check: (productId: string) => request<any>(`/api/wishlist/check/${productId}`),
  remove: (id: string) => request<any>(`/api/wishlist/${id}`, { method: "DELETE" }),
};

// ============================================
// ORDER API
// ============================================
export const orderApi = {
  create: (promoCode?: string, shippingAddress?: any) =>
    request<any>("/api/orders", { method: "POST", body: JSON.stringify({ promoCode, shippingAddress }) }),
  list: () => request<any>("/api/orders"),
  get: (id: string) => request<any>(`/api/orders/${id}`),
  track: (id: string) => request<any>(`/api/orders/${id}/tracking`),
};

// ============================================
// PAYMENT API
// ============================================
export const paymentApi = {
  create: (orderId: string) =>
    request<any>("/api/payment/create", { method: "POST", body: JSON.stringify({ orderId }) }),
  verify: (data: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) =>
    request<any>("/api/payment/verify", { method: "POST", body: JSON.stringify(data) }),
  status: (orderId: string) => request<any>(`/api/payment/status/${orderId}`),
};

// ============================================
// PROMO API (public validation)
// ============================================
export const promoApi = {
  validate: (code: string, cartTotal: number) =>
    request<any>("/api/promos/validate", { method: "POST", body: JSON.stringify({ code, cartTotal }) }),
};

// ============================================
// SETTINGS API (public)
// ============================================
export const settingsApi = {
  getPublic: () => request<any>("/api/settings/public"),
};

// ============================================
// MESSAGES API (public)
// ============================================
export const messageApi = {
  create: (data: { name: string; email: string; message: string }) =>
    request<any>("/api/messages", { method: "POST", body: JSON.stringify(data) }),
};

// ============================================
// ADMIN API
// ============================================
export const adminApi = {
  login: (username: string, password: string) =>
    request<any>("/api/admin/login", { method: "POST", body: JSON.stringify({ username, password }) }),
  dashboard: () => adminRequest<any>("/api/admin/dashboard"),
  users: (params?: Record<string, string>) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return adminRequest<any>(`/api/admin/users${query}`);
  },
  updateProfile: (data: any) =>
    adminRequest<any>("/api/admin/profile", { method: "PUT", body: JSON.stringify(data) }),

  // Admin management
  listAdmins: () => adminRequest<any>("/api/admin/admins"),
  createAdmin: (data: any) =>
    adminRequest<any>("/api/admin/admins", { method: "POST", body: JSON.stringify(data) }),
  deleteAdmin: (id: string) =>
    adminRequest<any>(`/api/admin/admins/${id}`, { method: "DELETE" }),

  // Products (admin)
  createProduct: (data: any) =>
    adminRequest<any>("/api/products", { method: "POST", body: JSON.stringify(data) }),
  updateProduct: (id: string, data: any) =>
    adminRequest<any>(`/api/products/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteProduct: (id: string) =>
    adminRequest<any>(`/api/products/${id}`, { method: "DELETE" }),

  // Sections (admin)
  createSection: (data: any) =>
    adminRequest<any>("/api/sections", { method: "POST", body: JSON.stringify(data) }),
  updateSection: (id: string, data: any) =>
    adminRequest<any>(`/api/sections/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteSection: (id: string) =>
    adminRequest<any>(`/api/sections/${id}`, { method: "DELETE" }),

  // Orders (admin)
  orders: (params?: Record<string, string>) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return adminRequest<any>(`/api/orders/admin/all${query}`);
  },
  updateOrderStatus: (id: string, data: any) =>
    adminRequest<any>(`/api/orders/admin/${id}/status`, { method: "PUT", body: JSON.stringify(data) }),
  getInvoice: (id: string) => adminRequest<any>(`/api/orders/admin/${id}/invoice`),

  // Promos (admin)
  listPromos: () => adminRequest<any>("/api/promos"),
  createPromo: (data: any) =>
    adminRequest<any>("/api/promos", { method: "POST", body: JSON.stringify(data) }),
  updatePromo: (id: string, data: any) =>
    adminRequest<any>(`/api/promos/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deletePromo: (id: string) =>
    adminRequest<any>(`/api/promos/${id}`, { method: "DELETE" }),

  // Notifications
  notifications: (params?: Record<string, string>) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return adminRequest<any>(`/api/notifications${query}`);
  },
  markRead: (id: string) =>
    adminRequest<any>(`/api/notifications/${id}/read`, { method: "PUT" }),
  markAllRead: () =>
    adminRequest<any>("/api/notifications/read-all", { method: "PUT" }),

  // Settings
  getSettings: () => adminRequest<any>("/api/settings"),
  updateSettings: (data: Record<string, string>) =>
    adminRequest<any>("/api/settings", { method: "PUT", body: JSON.stringify(data) }),

  // Push Notifications
  getVapidKey: () => adminRequest<any>("/api/admin/push/vapidPublic"),
  subscribePush: (subscription: any) =>
    adminRequest<any>("/api/admin/push/subscribe", { method: "POST", body: JSON.stringify({ subscription }) }),

  // Messages
  listMessages: () => adminRequest<any>("/api/messages"),
  deleteMessage: (id: string) => adminRequest<any>(`/api/messages/${id}`, { method: "DELETE" }),

  // Blog
  createBlogPost: (data: any) => adminRequest<any>("/api/blog", { method: "POST", body: JSON.stringify(data) }),
  updateBlogPost: (id: string, data: any) => adminRequest<any>(`/api/blog/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteBlogPost: (id: string) => adminRequest<any>(`/api/blog/${id}`, { method: "DELETE" }),

  // Upload
  uploadFiles,
  deleteFile: (url: string) => adminRequest<any>("/api/upload", { method: "DELETE", body: JSON.stringify({ url }) }),
};

// ============================================
// UPLOAD API
// ============================================
export const uploadApi = {
  uploadFile: async (file: File): Promise<string> => {
    const data = await uploadFiles([file]);
    if (data && data.files && data.files.length > 0) {
      return data.files[0].url;
    }
    throw new Error("Upload failed to return URL");
  },
  uploadFiles,
};

// ============================================
// BLOG API
// ============================================
export const blogApi = {
  list: () => request<any>("/api/blog"),
};

