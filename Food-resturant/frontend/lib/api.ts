const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface FetchOptions extends RequestInit {
  token?: string;
}

async function fetchAPI<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, ...fetchOptions } = options;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    fetchAPI<{ message: string; user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (data: { firstName?: string; lastName?: string; email: string; phone?: string; password: string; role?: string }) =>
    fetchAPI<{ message: string; user: any; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getProfile: (token: string) =>
    fetchAPI<{ user: any }>('/auth/profile', { token }),

  getAllUsers: (token: string) =>
    fetchAPI<{ users: any[] }>('/auth/users', { token }),
};

// Categories API
export const categoryAPI = {
  getAll: () => fetchAPI<{ categories: any[] }>(`/categories?_t=${Date.now()}`),
  
  getById: (id: number) => fetchAPI<{ category: any }>(`/categories/${id}?_t=${Date.now()}`),
  
  getBySlug: (slug: string) => fetchAPI<{ category: any }>(`/categories/slug/${slug}?_t=${Date.now()}`),
  
  create: (data: { name: string; slug: string; description?: string; parentId?: number; image?: string }, token: string) =>
    fetchAPI<{ message: string; category: any }>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),
  
  update: (id: number, data: { name: string; slug: string; description?: string; parentId?: number; image?: string }, token: string) =>
    fetchAPI<{ message: string; category: any }>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    }),
  
  delete: (id: number, token: string) =>
    fetchAPI<{ message: string }>(`/categories/${id}`, {
      method: 'DELETE',
      token,
    }),

  getTree: () => fetchAPI<{ categories: any[] }>(`/categories/tree?_t=${Date.now()}`),

  getParents: () => fetchAPI<{ categories: any[] }>(`/categories/parents?_t=${Date.now()}`),

  getChildren: (parentId: number) => fetchAPI<{ categories: any[] }>(`/categories/${parentId}/children?_t=${Date.now()}`),
};

// Products API
export const productAPI = {
  getAll: (params?: { limit?: number; offset?: number; category?: number }) => {
    const query = new URLSearchParams();
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.offset) query.set('offset', params.offset.toString());
    if (params?.category) query.set('category', params.category.toString());
    // Add cache bust
    query.set('_t', Date.now().toString());
    const queryStr = query.toString();
    return fetchAPI<{ products: any[] }>(`/products${queryStr ? `?${queryStr}` : ''}`);
  },
  
  getById: (id: number) => fetchAPI<{ product: any; images: any[] }>(`/products/${id}?_t=${Date.now()}`),
  
  getBySlug: (slug: string) => fetchAPI<{ product: any; images: any[] }>(`/products/slug/${slug}?_t=${Date.now()}`),
  
  getFeatured: () => fetchAPI<{ products: any[] }>(`/products/featured?_t=${Date.now()}`),
  
  search: (query: string) => fetchAPI<{ products: any[] }>(`/products/search?q=${encodeURIComponent(query)}&_t=${Date.now()}`),
  
  create: (data: {
    name: string;
    slug: string;
    description?: string;
    price: number;
    compareAtPrice?: number;
    sku?: string;
    stockQuantity?: number;
    categoryId?: number;
    featured?: boolean;
    status?: 'draft' | 'published';
  }, token: string) =>
    fetchAPI<{ message: string; product: any }>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),
  
  update: (id: number, data: {
    name: string;
    slug: string;
    description?: string;
    price: number;
    compareAtPrice?: number;
    sku?: string;
    stockQuantity?: number;
    categoryId?: number;
    featured?: boolean;
    status?: 'draft' | 'published';
  }, token: string) =>
    fetchAPI<{ message: string; product: any }>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    }),
  
  delete: (id: number, token: string) =>
    fetchAPI<{ message: string }>(`/products/${id}`, {
      method: 'DELETE',
      token,
    }),
  
  addImage: (id: number, imageUrl: string, isMain: boolean, token: string) =>
    fetchAPI<{ message: string; imageId: number }>(`/products/${id}/images`, {
      method: 'POST',
      body: JSON.stringify({ imageUrl, isMain }),
      token,
    }),
};

// Dashboard API
export const dashboardAPI = {
  getStats: (token: string) =>
    fetchAPI<{ stats: {
      products: { total: number; published: number; draft: number; outOfStock: number };
      categories: { total: number };
      orders: { totalOrders: number; pendingOrders: number; completedOrders: number; totalRevenue: number };
      users: { total: number };
    } }>('/dashboard/stats', { token }),
};

// Orders API
export const orderAPI = {
  getAll: (token: string) =>
    fetchAPI<{ orders: any[] }>('/orders', { token }),
  
  getById: (id: number, token: string) =>
    fetchAPI<{ order: any }>(`/orders/${id}`, { token }),
  
  create: (data: {
    totalAmount: number;
    paymentMethod: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    orderItems: any[];
    shippingAddress?: string;
    billingAddress?: string;
    paymentStatus?: 'unpaid' | 'paid' | 'refunded';
  }) =>
    fetchAPI<{ message: string; orderId: number }>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  updateStatus: (id: number, status: string, token: string) =>
    fetchAPI<{ message: string }>(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
      token,
    }),
  
  updatePaymentStatus: (id: number, paymentStatus: string, token: string) =>
    fetchAPI<{ message: string }>(`/orders/${id}/payment-status`, {
      method: 'PUT',
      body: JSON.stringify({ paymentStatus }),
      token,
    }),
  
  delete: (id: number, token: string) =>
    fetchAPI<{ message: string }>(`/orders/${id}`, {
      method: 'DELETE',
      token,
    }),
};

// Media API
export const mediaAPI = {
  upload: (formData: FormData, token: string) =>
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/media/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
    }).then(res => res.json()),
  
  getAll: (token: string) =>
    fetchAPI<{ files: any[] }>('/media', { token }),
  
  delete: (filename: string, token: string) =>
    fetchAPI<{ message: string }>(`/media/${filename}`, {
      method: 'DELETE',
      token,
    }),
};

// Settings API
export const settingsAPI = {
  get: (token: string) =>
    fetchAPI<{ settings: Record<string, any> }>('/settings', { token }),
  
  getPublic: () =>
    fetchAPI<{ settings: Record<string, string> }>('/settings/public'),
  
  update: (settings: Record<string, any>, token: string) =>
    fetchAPI<{ message: string }>('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
      token,
    }),
};

// Testimonials API
export const testimonialAPI = {
  getAll: () => fetchAPI<{ testimonials: any[] }>(`/testimonials?_t=${Date.now()}`),
  getAdminList: (token: string) => fetchAPI<{ testimonials: any[] }>('/testimonials/admin', { token }),
  create: (data: { name: string; company?: string; quote: string; avatarUrl?: string; sortOrder?: number; status?: 'draft' | 'published' }, token: string) =>
    fetchAPI<{ message: string; testimonial: any }>('/testimonials', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),
  update: (id: number, data: { name: string; company?: string; quote: string; avatarUrl?: string; sortOrder?: number; status?: 'draft' | 'published' }, token: string) =>
    fetchAPI<{ message: string; testimonial: any }>(`/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    }),
  delete: (id: number, token: string) =>
    fetchAPI<{ message: string }>(`/testimonials/${id}`, {
      method: 'DELETE',
      token,
    }),
};

// Home Page CMS API
export const homePageAPI = {
  getAll: () => fetchAPI<{ content: Record<string, any> }>(`/home-page?_t=${Date.now()}`),
  update: (content: Record<string, any>, token: string) =>
    fetchAPI<{ message: string; content: Record<string, any> }>('/home-page', {
      method: 'PUT',
      body: JSON.stringify({ content }),
      token,
    }),
};

// About Page CMS API
export const aboutPageAPI = {
  getAll: () => fetchAPI<{ content: Record<string, any> }>(`/about-page?_t=${Date.now()}`),
  update: (content: Record<string, any>, token: string) =>
    fetchAPI<{ message: string; content: Record<string, any> }>('/about-page', {
      method: 'PUT',
      body: JSON.stringify({ content }),
      token,
    }),
};

// Stripe API
export const stripeAPI = {
  /** Admin: get publishable key (requires admin token) */
  getConfig: (token: string) =>
    fetchAPI<{ publishableKey: string }>('/stripe/config', { token }),

  /** Public: get publishable key for Stripe.js init (no auth needed) */
  getPublicConfig: () =>
    fetchAPI<{ publishableKey: string }>('/stripe/public-config'),

  /** Public: create a payment intent for checkout (no auth needed) */
  createPaymentIntent: (amount: number) =>
    fetchAPI<{ clientSecret: string }>('/stripe/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    }),
};

// Contact API
export const contactAPI = {
  submit: (data: { name: string; phone?: string; email?: string; message?: string; source?: 'home' | 'contact' }) =>
    fetchAPI<{ message: string; submission: any }>('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getAll: (token: string) =>
    fetchAPI<{ submissions: any[] }>('/contact', { token }),

  delete: (id: number, token: string) =>
    fetchAPI<{ message: string }>(`/contact/${id}`, {
      method: 'DELETE',
      token,
    }),
};
