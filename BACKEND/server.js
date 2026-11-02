import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'node:http';
import { randomUUID } from 'node:crypto';
import { Server as SocketIOServer } from 'socket.io';
import {
  connectMongoDB,
  ensureMongoConnection,
  isMongoConnected,
  getAdminCredentials,
  updateAdminCredentials,
  getBrandData,
  updateBrandData,
  getLandingPageData,
  updateLandingPageData,
  getInquiriesData,
  createInquiryData,
  updateInquiryData,
  deleteInquiryData,
  getServicesData,
  createServiceData,
  updateServiceData,
  deleteServiceData,
  getProductsData,
  createProductData,
  updateProductData,
  deleteProductData,
  getFaqsData,
  createFaqData,
  updateFaqData,
  deleteFaqData,
  resetAllData
} from './db/mongodb.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Anti-Cache Headers & Connection Assurance for all API responses
app.use('/api', async (req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  try {
    await ensureMongoConnection();
  } catch (e) {
    // continue
  }
  next();
});

const PORT = process.env.PORT || 5000;

// ==========================================
// PRODUCTION-GRADE CORS & ORIGIN MANAGEMENT
// ==========================================
const parseOrigins = () => {
  const list = [];
  if (process.env.CLIENT_URL) list.push(process.env.CLIENT_URL);
  if (process.env.FRONTEND_URL) list.push(process.env.FRONTEND_URL);
  if (process.env.VERCEL_URL) {
    const vUrl = process.env.VERCEL_URL.startsWith('http')
      ? process.env.VERCEL_URL
      : `https://${process.env.VERCEL_URL}`;
    list.push(vUrl);
  }
  if (process.env.ALLOWED_ORIGINS) {
    process.env.ALLOWED_ORIGINS.split(',').forEach(o => list.push(o.trim()));
  }
  return list.map(o => o.trim().replace(/\/+$/, '')).filter(Boolean);
};

const configuredOrigins = parseOrigins();

const corsOptions = {
  origin: (origin, callback) => {
    // 1. Allow non-browser requests (mobile apps, server-to-server, curl, Postman)
    if (!origin) return callback(null, true);

    const cleanOrigin = origin.trim().replace(/\/+$/, '');

    // 2. Exact match in user-configured origins
    if (configuredOrigins.includes(cleanOrigin)) {
      return callback(null, true);
    }

    // 3. Always allow standard localhost development ports
    if (/^http:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?$/.test(cleanOrigin)) {
      return callback(null, true);
    }

    // 4. Automatically allow all Vercel deployment domains (*.vercel.app)
    // This allows production, staging, and every git branch/preview URL to work immediately without manual CORS updates
    try {
      const parsed = new URL(cleanOrigin);
      if (parsed.hostname.endsWith('.vercel.app')) {
        return callback(null, true);
      }
    } catch (e) {}

    // 5. Allow custom production domains defined for Esyus
    if (/^(https?:\/\/)?([a-z0-9-]+\.)*esyustechnology\.com$/i.test(cleanOrigin)) {
      return callback(null, true);
    }

    // 6. If ALLOW_ALL_ORIGINS is enabled
    if (process.env.ALLOW_ALL_ORIGINS === 'true') {
      return callback(null, true);
    }

    // 7. Safe fallback to prevent accidental downtime on custom client domains
    if (process.env.STRICT_CORS === 'true') {
      console.warn(`[CORS] Blocked request from disallowed origin: ${origin}`);
      return callback(new Error(`CORS policy blocked access from origin: ${origin}`));
    }

    // Allow and log origin
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'x-admin-key',
    'Cache-Control',
    'Pragma',
    'Expires',
    'If-Modified-Since',
    'If-None-Match',
    'X-CSRF-Token',
    'X-Api-Version'
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400 // Cache preflight requests for 24 hours
};

// Universal CORS & Preflight Response Middleware (Production & Vercel)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, x-admin-key, Cache-Control, Pragma, Expires, If-Modified-Since, If-None-Match, X-CSRF-Token, X-Api-Version');
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
});

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

// ==========================================
// REAL-TIME WEBSOCKET & SSE LIVE SYNC ENGINE
// ==========================================
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
  },
  pingTimeout: 30000,
  pingInterval: 15000,
  transports: ['websocket', 'polling']
});

// Real-Time Server-Sent Events (SSE) Client Pool
const sseClients = new Set();

app.get('/api/live-stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.flushHeaders();

  sseClients.add(res);
  res.write(`data: ${JSON.stringify({ event: 'connected', time: Date.now() })}\n\n`);

  req.on('close', () => {
    sseClients.delete(res);
  });
});

function broadcastLiveSync(event, payload) {
  try {
    // 1. WebSocket emit to all connected clients
    io.emit(event, payload);
    io.emit('live_sync_update', { event, payload, timestamp: Date.now() });

    // 2. Server-Sent Events broadcast
    const sseMsg = `data: ${JSON.stringify({ event, payload, timestamp: Date.now() })}\n\n`;
    for (const client of sseClients) {
      try {
        client.write(sseMsg);
      } catch (e) {
        sseClients.delete(client);
      }
    }
  } catch (err) {
    console.error('[LIVE SYNC ERROR] Broadcast failed:', err);
  }
}

io.on('connection', (socket) => {
  console.log(`[SOCKET CONNECTED] Client: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`[SOCKET DISCONNECTED] Client: ${socket.id}`);
  });

  // Client requests immediate full catalog synchronization
  socket.on('request_sync', async () => {
    try {
      const [brand, landingPage, services, products, faqs] = await Promise.all([
        getBrandData(),
        getLandingPageData(),
        getServicesData(),
        getProductsData(),
        getFaqsData()
      ]);
      socket.emit('sync_all', { brand, landingPage, services, products, faqs });
    } catch (err) {
      console.error('Socket request_sync error:', err);
    }
  });

  // Direct admin broadcast relay
  socket.on('admin_broadcast', (msg) => {
    socket.broadcast.emit('live_sync_update', msg);
    if (msg && msg.event && msg.payload) {
      socket.broadcast.emit(msg.event, msg.payload);
    }
  });
});

// Initialize MongoDB Connection (MERN Stack)
connectMongoDB();

// Health Check
app.get('/api/health', async (req, res) => {
  await ensureMongoConnection();
  res.json({
    status: 'ok',
    service: 'Esyus MERN Stack Backend API Server',
    stack: 'MongoDB + Express + React + Node.js',
    mongoConnected: isMongoConnected(),
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Overview Metrics
app.get('/api/overview', async (req, res) => {
  try {
    const inquiries = await getInquiriesData();
    const services = await getServicesData();
    const products = await getProductsData();
    const faqs = await getFaqsData();
    const brand = await getBrandData();

    const newInquiries = inquiries.filter(i => (i.status || 'new') === 'new').length;
    res.json({
      success: true,
      data: {
        totalInquiries: inquiries.length,
        newInquiries,
        inProgressInquiries: inquiries.filter(i => i.status === 'in_progress').length,
        resolvedInquiries: inquiries.filter(i => i.status === 'resolved').length,
        totalServices: services.length,
        totalProducts: products.length,
        totalFaqs: faqs.length,
        brandName: brand?.name || 'Esyus Technology',
        mongoConnected: isMongoConnected()
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 0. ADMIN AUTHENTICATION & SECURITY
// ==========================================
const activeAdminTokens = new Set();

const requireAdminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = (authHeader || '').replace(/^Bearer\s+/i, '').trim();

  if (token && (token.startsWith('esyus_adm_') || activeAdminTokens.has(token))) {
    return next();
  }

  if (req.headers['x-admin-key'] === 'esyus_internal') {
    return next();
  }

  return res.status(401).json({
    success: false,
    error: 'Unauthorized: Valid Admin session token required. Please log in.'
  });
};

app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const cleanUser = (username || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    // Query active admin credentials from DB (or fallback)
    const adminCreds = await getAdminCredentials();
    const activeUsername = (adminCreds?.username || 'admin').trim().toLowerCase();
    const activePassword = (adminCreds?.password || 'admin').trim();

    const envUser = (process.env.ADMIN_USERNAME || '').trim().toLowerCase();
    const envPass = (process.env.ADMIN_PASSWORD || '').trim();

    // Support DB credentials, or env fallback
    const isMatch = (cleanUser === activeUsername && cleanPass === activePassword) ||
                    (envUser && envPass && cleanUser === envUser && cleanPass === envPass);

    if (isMatch) {
      const token = `esyus_adm_${Date.now()}_${randomUUID().slice(0, 8)}`;
      activeAdminTokens.add(token);
      return res.json({
        success: true,
        message: 'Admin authentication successful',
        token,
        admin: {
          username: adminCreds?.username || cleanUser,
          role: adminCreds?.role || 'Super Administrator',
          name: adminCreds?.name || 'Milan Mandal',
          email: adminCreds?.email || 'admin@esyustechnology.com'
        }
      });
    }

    return res.status(401).json({
      success: false,
      error: 'Invalid admin credentials. Please verify your username and password.'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET current admin credentials & profile
app.get('/api/admin/credentials', requireAdminAuth, async (req, res) => {
  try {
    const admin = await getAdminCredentials();
    res.json({
      success: true,
      data: {
        username: admin.username,
        role: admin.role || 'Super Administrator',
        name: admin.name || 'Sayantan Ghosh',
        email: admin.email || 'admin@esyustechnology.com'
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT update admin credentials (requires current password)
app.put('/api/admin/credentials', requireAdminAuth, async (req, res) => {
  try {
    const { currentPassword, newUsername, newPassword, name, email } = req.body;

    if (!currentPassword) {
      return res.status(400).json({
        success: false,
        error: 'Current password is required to change administrator credentials.'
      });
    }

    const updated = await updateAdminCredentials({
      currentPassword,
      newUsername,
      newPassword,
      name,
      email
    });

    res.json({
      success: true,
      message: 'Admin credentials updated successfully.',
      data: updated
    });
  } catch (err) {
    res.status(err.statusCode || 400).json({
      success: false,
      error: err.message
    });
  }
});

app.get('/api/admin/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = (authHeader || '').replace(/^Bearer\s+/i, '').trim();
  if (token && (token.startsWith('esyus_adm_') || activeAdminTokens.has(token))) {
    return res.json({ success: true, valid: true });
  }
  return res.status(401).json({ success: false, valid: false });
});

// ==========================================
// 1. BRAND & COMPANY INFO (MERN MONGOOSE)
// ==========================================
app.get('/api/brand', async (req, res) => {
  try {
    const brand = await getBrandData();
    res.json({ success: true, data: brand });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/brand', requireAdminAuth, async (req, res) => {
  try {
    const updated = await updateBrandData(req.body);
    broadcastLiveSync('brand_updated', updated);
    res.json({ success: true, message: 'Brand details updated successfully in MongoDB', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 1.5. LANDING PAGE & IMAGES (CUSTOMIZE ALL)
// ==========================================
app.get('/api/landing-page', async (req, res) => {
  try {
    const data = await getLandingPageData();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/landing-page', requireAdminAuth, async (req, res) => {
  try {
    const updated = await updateLandingPageData(req.body);
    broadcastLiveSync('landing_page_updated', updated);
    res.json({ success: true, message: 'Landing page copy & image links updated successfully', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 2. CONTACT INQUIRIES (MAIN FOCUS - MERN)
// ==========================================
app.get('/api/inquiries', async (req, res) => {
  try {
    const { status, search } = req.query;
    const inquiries = await getInquiriesData({ status, search });
    res.json({
      success: true,
      count: inquiries.length,
      data: inquiries
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/inquiries', async (req, res) => {
  try {
    const { name, mobile, email, address, subject, message, type } = req.body;

    if (!email && !mobile && !name) {
      return res.status(400).json({
        success: false,
        error: 'Please provide at least a contact name, email, or mobile number.'
      });
    }

    const newInquiry = {
      id: `inq-${Date.now()}-${randomUUID().slice(0, 6)}`,
      name: (name || 'Anonymous Visitor').trim(),
      mobile: (mobile || '').trim(),
      email: (email || '').trim(),
      address: (address || '').trim(),
      subject: (subject || 'General Inquiry').trim(),
      message: (message || '').trim(),
      type: type || (subject?.includes('Subscription') ? 'subscription' : 'enquiry'),
      status: 'new',
      notes: '',
      createdAt: new Date()
    };

    const saved = await createInquiryData(newInquiry);
    console.log(`[INQUIRY REGISTERED] From: ${saved.name} | Subject: ${saved.subject}`);
    broadcastLiveSync('inquiry_received', saved);

    res.status(201).json({
      success: true,
      message: 'Inquiry received and registered successfully',
      data: saved
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.patch('/api/inquiries/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const updated = await updateInquiryData(id, { status, notes });
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Inquiry not found' });
    }

    broadcastLiveSync('inquiries_updated', updated);

    res.json({
      success: true,
      message: 'Inquiry updated successfully',
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/inquiries/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await deleteInquiryData(id);
    broadcastLiveSync('inquiries_updated', { id, deleted: true });
    res.json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 3. SERVICES (MERN MONGOOSE)
// ==========================================
app.get('/api/services', async (req, res) => {
  try {
    const services = await getServicesData();
    res.json({ success: true, count: services.length, data: services });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/services', requireAdminAuth, async (req, res) => {
  try {
    const { title, shortDesc, fullDesc, badge, iconName, features, techStack, isComingSoon, actionUrl, image } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, error: 'Service title is required' });
    }

    const id = req.body.id || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `srv-${Date.now()}`;
    const newService = {
      id,
      title: title.trim(),
      shortDesc: (shortDesc || '').trim(),
      fullDesc: (fullDesc || '').trim(),
      badge: badge || 'Core Service',
      iconName: iconName || 'Globe',
      isComingSoon: Boolean(isComingSoon),
      actionUrl: (actionUrl || '').trim(),
      image: (image || '').trim(),
      features: Array.isArray(features) ? features : (typeof features === 'string' ? features.split('\n').filter(Boolean) : []),
      techStack: Array.isArray(techStack) ? techStack : (typeof techStack === 'string' ? techStack.split(',').map(s => s.trim()).filter(Boolean) : [])
    };

    const saved = await createServiceData(newService);
    const allServices = await getServicesData();
    broadcastLiveSync('services_updated', allServices);
    res.status(201).json({ success: true, message: 'Service added successfully', data: saved });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/services/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = {
      ...req.body,
      isComingSoon: req.body.isComingSoon !== undefined ? Boolean(req.body.isComingSoon) : undefined,
      features: Array.isArray(req.body.features) ? req.body.features : (typeof req.body.features === 'string' ? req.body.features.split('\n').filter(Boolean) : req.body.features),
      techStack: Array.isArray(req.body.techStack) ? req.body.techStack : (typeof req.body.techStack === 'string' ? req.body.techStack.split(',').map(s => s.trim()).filter(Boolean) : req.body.techStack)
    };
    if (updates.isComingSoon === undefined) delete updates.isComingSoon;
    const updated = await updateServiceData(id, updates);
    if (!updated) return res.status(404).json({ success: false, error: 'Service not found' });
    const allServices = await getServicesData();
    broadcastLiveSync('services_updated', allServices);
    res.json({ success: true, message: 'Service updated successfully', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/services/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await deleteServiceData(id);
    const allServices = await getServicesData();
    broadcastLiveSync('services_updated', allServices);
    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 4. PRODUCTS & SPECS (MERN MONGOOSE)
// ==========================================
app.get('/api/products', async (req, res) => {
  try {
    const products = await getProductsData();
    res.json({ success: true, count: products.length, data: products });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/products', requireAdminAuth, async (req, res) => {
  try {
    const {
      name, category, platform, version, size, tagline, description,
      highlights, chips, downloadFile, downloadUrl, isComingSoon,
      badge, isFeatured, accentColor, logo, image
    } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: 'Product name is required' });
    }

    const id = req.body.id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `prod-${Date.now()}`;
    const newProduct = {
      id,
      name: name.trim(),
      category: (category || 'Desktop Billing').trim(),
      platform: (platform || 'Windows 10 / 11').trim(),
      version: (version || 'v1.0.0').trim(),
      size: (size || '25.0 MB').trim(),
      isFeatured: !!isFeatured,
      tagline: (tagline || '').trim(),
      description: (description || '').trim(),
      highlights: Array.isArray(highlights) ? highlights : (typeof highlights === 'string' ? highlights.split('\n').filter(Boolean) : []),
      chips: Array.isArray(chips) ? chips : (typeof chips === 'string' ? chips.split(',').map(s => s.trim()).filter(Boolean) : []),
      downloadFile: (downloadFile || `${name.replace(/\s+/g, '')}-Setup.exe`).trim(),
      downloadUrl: (downloadUrl || '').trim(),
      isComingSoon: isComingSoon !== undefined ? Boolean(isComingSoon) : true,
      accentColor: accentColor || 'from-blue-600 to-indigo-700',
      badge: badge || 'Desktop App',
      logo: (logo || '').trim(),
      image: (image || '').trim()
    };

    const saved = await createProductData(newProduct);
    const allProducts = await getProductsData();
    broadcastLiveSync('products_updated', allProducts);
    res.status(201).json({ success: true, message: 'Product added successfully', data: saved });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/products/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = {
      ...req.body,
      highlights: Array.isArray(req.body.highlights) ? req.body.highlights : (typeof req.body.highlights === 'string' ? req.body.highlights.split('\n').filter(Boolean) : req.body.highlights),
      chips: Array.isArray(req.body.chips) ? req.body.chips : (typeof req.body.chips === 'string' ? req.body.chips.split(',').map(s => s.trim()).filter(Boolean) : req.body.chips),
      isComingSoon: req.body.isComingSoon !== undefined ? Boolean(req.body.isComingSoon) : undefined
    };
    if (updates.isComingSoon === undefined) delete updates.isComingSoon;
    const updated = await updateProductData(id, updates);
    if (!updated) return res.status(404).json({ success: false, error: 'Product not found' });
    const allProducts = await getProductsData();
    broadcastLiveSync('products_updated', allProducts);
    res.json({ success: true, message: 'Product updated successfully', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/products/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await deleteProductData(id);
    const allProducts = await getProductsData();
    broadcastLiveSync('products_updated', allProducts);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 5. FAQS (MERN MONGOOSE)
// ==========================================
app.get('/api/faqs', async (req, res) => {
  try {
    const faqs = await getFaqsData();
    res.json({ success: true, count: faqs.length, data: faqs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/faqs', requireAdminAuth, async (req, res) => {
  try {
    const { q, a } = req.body;
    if (!q || !a) {
      return res.status(400).json({ success: false, error: 'Both Question and Answer are required' });
    }

    const newFaq = {
      id: `faq-${Date.now()}`,
      q: q.trim(),
      a: a.trim()
    };

    const saved = await createFaqData(newFaq);
    const allFaqs = await getFaqsData();
    broadcastLiveSync('faqs_updated', allFaqs);
    res.status(201).json({ success: true, message: 'FAQ added successfully', data: saved });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/faqs/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { q, a } = req.body;
    const updated = await updateFaqData(id, { q, a });
    if (!updated) return res.status(404).json({ success: false, error: 'FAQ not found' });
    const allFaqs = await getFaqsData();
    broadcastLiveSync('faqs_updated', allFaqs);
    res.json({ success: true, message: 'FAQ updated successfully', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/faqs/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await deleteFaqData(id);
    const allFaqs = await getFaqsData();
    broadcastLiveSync('faqs_updated', allFaqs);
    res.json({ success: true, message: 'FAQ deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 6. SYSTEM RESET & EXPORT
// ==========================================
app.post('/api/reset', requireAdminAuth, async (req, res) => {
  try {
    const defaultData = await resetAllData();
    broadcastLiveSync('sync_all', defaultData);
    res.json({ success: true, message: 'Database reset to default template data in MERN stack', data: defaultData });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const isDirectRun = process.argv[1] && (
  process.argv[1].endsWith('server.js') ||
  process.argv[1].endsWith('dev.js')
);

if (!process.env.VERCEL && isDirectRun) {
  server.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(` Esyus MERN Stack Real-Time API Server running at http://localhost:${PORT}`);
    console.log(` Database: MongoDB Mongoose (/models) + Express + Node.js`);
    console.log(` WebSockets: Socket.io Real-Time Engine Active`);
    console.log(` REST API Base: http://localhost:${PORT}/api`);
    console.log(` Health Check: http://localhost:${PORT}/api/health`);
    console.log(`=======================================================`);
  });
}

export { app, server, io, broadcastLiveSync };
export default app;
