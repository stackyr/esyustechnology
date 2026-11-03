// API Client Service for Frontend & Admin Panel (Production & Vercel Ready)
const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
const isLocalhost = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname === '0.0.0.0'
);

// Resolve production-ready API base URL
function resolveApiBase() {
  // Development localhost default: always connect to local MERN Express server
  if (isLocalhost) {
    return 'http://localhost:5000/api';
  }

  let envUrl = (import.meta.env.VITE_API_URL || '').trim();

  if (envUrl && !envUrl.includes('localhost')) {
    // Remove trailing slashes
    envUrl = envUrl.replace(/\/+$/, '');

    // Upgrade http to https on secure production origin (prevent browser mixed-content blocks)
    if (isHttps && envUrl.startsWith('http://')) {
      envUrl = envUrl.replace(/^http:\/\//i, 'https://');
    }

    // Automatically append /api if user only supplied the base origin
    if (!envUrl.endsWith('/api') && !envUrl.includes('/api/')) {
      envUrl = `${envUrl}/api`;
    }

    return envUrl;
  }

  // Production fallback if VITE_API_URL was omitted (for reverse proxy or Vercel rewrites)
  return '/api';
}

const API_BASE = resolveApiBase();

async function request(path, options = {}) {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const separator = cleanPath.includes('?') ? '&' : '?';
  const url = (options.method && options.method !== 'GET')
    ? `${API_BASE}${cleanPath}`
    : `${API_BASE}${cleanPath}${separator}_t=${Date.now()}`;
  const defaultHeaders = {
    'Content-Type': 'application/json',

  };

  try {
    const token = typeof window !== 'undefined' && window.localStorage ? window.localStorage.getItem('esyus_admin_token') : null;
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
  } catch (e) {}

  const controller = new AbortController();
  const timeoutMs = options.timeout || ((options.method === 'POST' || options.method === 'PUT' || options.method === 'DELETE') ? 25000 : 10000);
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      cache: 'no-store',
      signal: options.signal || controller.signal,
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });
    clearTimeout(timeoutId);

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || `HTTP error! status: ${res.status}`);
    }
    return data;
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn(`[API] Request to ${path} failed:`, err.message);
    throw err;
  }
}

export const api = {
  // Admin Authentication
  loginAdmin: (credentials) => request('/admin/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  verifyAdmin: (token) => request('/admin/verify', {
    headers: { Authorization: `Bearer ${token}` },
  }),
  getAdminCredentials: () => request('/admin/credentials'),
  updateAdminCredentials: (data) => request('/admin/credentials', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Brand & Company Settings
  getBrand: () => request('/brand'),
  updateBrand: (brandData) => request('/brand', {
    method: 'PUT',
    body: JSON.stringify(brandData),
  }),

  // Landing Page Sections & Images
  getLandingPage: () => request('/landing-page'),
  updateLandingPage: (pageData) => request('/landing-page', {
    method: 'PUT',
    body: JSON.stringify(pageData),
  }),

  // Services
  getServices: () => request('/services'),
  createService: (serviceData) => request('/services', {
    method: 'POST',
    body: JSON.stringify(serviceData),
  }),
  updateService: (id, serviceData) => request(`/services/${id}`, {
    method: 'PUT',
    body: JSON.stringify(serviceData),
  }),
  deleteService: (id) => request(`/services/${id}`, {
    method: 'DELETE',
  }),

  // Products & Specs
  getProducts: () => request('/products'),
  createProduct: (productData) => request('/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  }),
  updateProduct: (id, productData) => request(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  }),
  deleteProduct: (id) => request(`/products/${id}`, {
    method: 'DELETE',
  }),

  // FAQs
  getFaqs: () => request('/faqs'),
  createFaq: (faqData) => request('/faqs', {
    method: 'POST',
    body: JSON.stringify(faqData),
  }),
  updateFaq: (id, faqData) => request(`/faqs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(faqData),
  }),
  deleteFaq: (id) => request(`/faqs/${id}`, {
    method: 'DELETE',
  }),

  // Inquiries (MAIN FOCUS)
  getInquiries: (params = {}) => {
    const query = new URLSearchParams();
    if (params.status) query.set('status', params.status);
    if (params.search) query.set('search', params.search);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request(`/inquiries${queryString}`);
  },
  submitInquiry: (inquiryData) => request('/inquiries', {
    method: 'POST',
    body: JSON.stringify(inquiryData),
  }),
  updateInquiry: (id, updateData) => request(`/inquiries/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updateData),
  }),
  deleteInquiry: (id) => request(`/inquiries/${id}`, {
    method: 'DELETE',
  }),

  // Overview Metrics
  getOverview: () => request('/overview'),

  // Reset to default template data
  resetDefaults: () => request('/reset', {
    method: 'POST',
  }),

  // Health
  checkHealth: () => request('/health'),
};

export default api;

