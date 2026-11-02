// API Client Service for Frontend & Admin Panel
const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const API_BASE = import.meta.env.VITE_API_URL || (isLocalhost ? 'http://localhost:5000/api' : '/api');

async function request(path, options = {}) {
  if (isHttps && API_BASE.startsWith('http://')) {
    // Avoid mixed-content blocking on secure hosting environments like Vercel
    return { data: null };
  }

  const url = `${API_BASE}${path}`;
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  try {
    const token = typeof window !== 'undefined' && window.localStorage ? window.localStorage.getItem('esyus_admin_token') : null;
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
  } catch (e) {}

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || `HTTP error! status: ${res.status}`);
    }
    return data;
  } catch (err) {
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

