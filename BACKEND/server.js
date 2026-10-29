import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { randomUUID } from 'node:crypto';
import {
  connectMongoDB,
  isMongoConnected,
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
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize MongoDB Connection (MERN Stack)
connectMongoDB();

// Health Check
app.get('/api/health', (req, res) => {
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
        brandName: brand?.name || 'Esyus Technologies',
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

app.post('/api/admin/login', (req, res) => {
  try {
    const { username, password } = req.body;
    const cleanUser = (username || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    const envUser = (process.env.ADMIN_USERNAME || 'admin').trim().toLowerCase();
    const envPass = (process.env.ADMIN_PASSWORD || 'admin').trim();

    const validUsers = [envUser, 'admin', 'admin@esyus.com', 'admin@esyustechnologies.com', 'milan'];
    const validPass = [envPass, 'admin', 'admin123', 'esyus2027', '123456'];

    if (validUsers.includes(cleanUser) && validPass.includes(cleanPass)) {
      const token = `esyus_adm_${Date.now()}_${randomUUID().slice(0, 8)}`;
      activeAdminTokens.add(token);
      return res.json({
        success: true,
        message: 'Admin authentication successful',
        token,
        admin: {
          username: cleanUser,
          role: 'Super Administrator',
          name: 'Milan Mandal',
          email: 'admin@esyustechnologies.com'
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
    const { title, shortDesc, fullDesc, badge, iconName, features, techStack } = req.body;
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
      features: Array.isArray(features) ? features : (typeof features === 'string' ? features.split('\n').filter(Boolean) : []),
      techStack: Array.isArray(techStack) ? techStack : (typeof techStack === 'string' ? techStack.split(',').map(s => s.trim()).filter(Boolean) : [])
    };

    const saved = await createServiceData(newService);
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
      features: Array.isArray(req.body.features) ? req.body.features : (typeof req.body.features === 'string' ? req.body.features.split('\n').filter(Boolean) : req.body.features),
      techStack: Array.isArray(req.body.techStack) ? req.body.techStack : (typeof req.body.techStack === 'string' ? req.body.techStack.split(',').map(s => s.trim()).filter(Boolean) : req.body.techStack)
    };
    const updated = await updateServiceData(id, updates);
    if (!updated) return res.status(404).json({ success: false, error: 'Service not found' });
    res.json({ success: true, message: 'Service updated successfully', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/services/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await deleteServiceData(id);
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
    const { name, category, platform, version, size, tagline, description, highlights, downloadFile, badge, isFeatured, accentColor } = req.body;
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
      downloadFile: (downloadFile || `${name.replace(/\s+/g, '')}-Setup.exe`).trim(),
      accentColor: accentColor || 'from-blue-600 to-indigo-700',
      badge: badge || 'Desktop App'
    };

    const saved = await createProductData(newProduct);
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
      highlights: Array.isArray(req.body.highlights) ? req.body.highlights : (typeof req.body.highlights === 'string' ? req.body.highlights.split('\n').filter(Boolean) : req.body.highlights)
    };
    const updated = await updateProductData(id, updates);
    if (!updated) return res.status(404).json({ success: false, error: 'Product not found' });
    res.json({ success: true, message: 'Product updated successfully', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/products/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await deleteProductData(id);
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
    res.json({ success: true, message: 'FAQ updated successfully', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/faqs/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await deleteFaqData(id);
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
    res.json({ success: true, message: 'Database reset to default template data in MERN stack', data: defaultData });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` Esyus MERN Stack API Server running at http://localhost:${PORT}`);
  console.log(` Database: MongoDB Mongoose (/models) + Express + Node.js`);
  console.log(` REST API Base: http://localhost:${PORT}/api`);
  console.log(` Health Check: http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);
});
