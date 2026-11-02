import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Brand } from '../models/Brand.js';
import { Service } from '../models/Service.js';
import { Product } from '../models/Product.js';
import { Faq } from '../models/Faq.js';
import { Inquiry } from '../models/Inquiry.js';
import { LandingPage } from '../models/LandingPage.js';
import { Admin } from '../models/Admin.js';
import { getDB, saveDB, resetDB as resetLocalDB } from '../db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const ATLAS_FALLBACK_URI = 'mongodb+srv://milanmmandal123_db_user:rGC22L2SCje3Mtko@esyus.egjlhr5.mongodb.net/test?retryWrites=true&w=majority';

const getMongoUri = () => {
  let uri = (process.env.MONGODB_URI || '').trim();
  if (!uri || uri.includes('localhost') || uri.includes('127.0.0.1')) {
    uri = ATLAS_FALLBACK_URI;
  }
  if (uri.startsWith('mongodb+srv://') && !uri.includes('?')) {
    uri = uri.replace(/\/?$/, '/test?retryWrites=true&w=majority');
  }
  return uri;
};

// Global cached connection for Node.js daemons and Serverless cold-starts
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const MONGO_OPTIONS = {
  maxPoolSize: 15,
  minPoolSize: 2,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  heartbeatFrequencyMS: 10000,
  connectTimeoutMS: 10000,
  autoIndex: true
};

let listenersRegistered = false;

function setupConnectionListeners() {
  if (listenersRegistered) return;
  listenersRegistered = true;

  mongoose.connection.on('connected', () => {
    console.log(`[MERN: MongoDB Atlas] Connection active: ${mongoose.connection.name}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('[MERN: MongoDB Atlas] Connection severed. Auto-reconnecting in 2 seconds...');
    cached.conn = null;
    cached.promise = null;
    setTimeout(() => {
      connectMongoDB().catch((e) => console.warn('[Auto-reconnect error]:', e.message));
    }, 2000);
  });

  mongoose.connection.on('error', (err) => {
    console.error('[MERN: MongoDB Atlas] Connection error:', err.message);
  });
}

export async function connectMongoDB() {
  setupConnectionListeners();

  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    mongoose.set('strictQuery', false);
    const uri = getMongoUri();
    cached.promise = mongoose.connect(uri, MONGO_OPTIONS).then(async (conn) => {
      console.log(`[MERN: MongoDB Atlas] Successfully connected to database: ${conn.connection.name}`);
      await seedMongoDefaults();
      return conn;
    }).catch((err) => {
      cached.promise = null;
      console.warn(`[MERN: MongoDB Atlas] Connection attempt failed (${err.message}). Retrying...`);
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    return null;
  }
}

export async function ensureMongoConnection() {
  if (mongoose.connection.readyState === 1) {
    return true;
  }
  try {
    await connectMongoDB();
    return mongoose.connection.readyState === 1;
  } catch (e) {
    return false;
  }
}

export function isMongoConnected() {
  return mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2;
}

// Seed default data into MongoDB from local defaults
async function seedMongoDefaults() {
  if (!isMongoConnected()) return;

  try {
    const local = getDB();

    // 1. Brand
    const brandCount = await Brand.countDocuments();
    if (brandCount === 0 && local.brand) {
      await Brand.create(local.brand);
      console.log('[MERN: MongoDB] Seeded initial Brand configuration.');
    }

    // 2. Services
    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0 && local.services?.length) {
      await Service.insertMany(local.services);
      console.log(`[MERN: MongoDB] Seeded ${local.services.length} services.`);
    }

    // 3. Products
    const prodCount = await Product.countDocuments();
    if (prodCount === 0 && local.products?.length) {
      await Product.insertMany(local.products);
      console.log(`[MERN: MongoDB] Seeded ${local.products.length} products.`);
    }

    // 4. FAQs
    const faqCount = await Faq.countDocuments();
    if (faqCount === 0 && local.faqs?.length) {
      await Faq.insertMany(local.faqs);
      console.log(`[MERN: MongoDB] Seeded ${local.faqs.length} FAQs.`);
    }

    // 5. Inquiries
    const inqCount = await Inquiry.countDocuments();
    if (inqCount === 0 && local.inquiries?.length) {
      await Inquiry.insertMany(local.inquiries);
      console.log(`[MERN: MongoDB] Seeded ${local.inquiries.length} initial inquiries.`);
    }

    // 6. Landing Page Sections & Images
    const landingCount = await LandingPage.countDocuments();
    if (landingCount === 0 && local.landingPage) {
      await LandingPage.create(local.landingPage);
      console.log(`[MERN: MongoDB] Seeded initial Landing Page section copy and image URLs.`);
    }

    // 7. Admin Credentials
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0 && local.admin) {
      await Admin.create(local.admin);
      console.log(`[MERN: MongoDB] Seeded initial Admin credentials.`);
    }
    // Always sync env Admin credentials if configured
    if (process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD) {
      await Admin.updateOne(
        {},
        {
          $set: {
            username: process.env.ADMIN_USERNAME.trim(),
            password: process.env.ADMIN_PASSWORD.trim()
          }
        },
        { upsert: true }
      );
      console.log(`[MERN: MongoDB] Verified Admin credentials for ${process.env.ADMIN_USERNAME}`);
    }
  } catch (e) {
    console.error('[MERN: MongoDB] Seed error:', e.message);
  }
}

// ==============================================
// Unified Store API (Mongoose with fallback)
// ==============================================

// 0. ADMIN CREDENTIALS & SECURITY
export async function getAdminCredentials() {
  await ensureMongoConnection();
  if (isMongoConnected()) {
    const doc = await Admin.findOne().sort({ createdAt: 1 }).lean();
    if (doc) return doc;
  }
  const db = getDB();
  return db.admin || {
    username: 'admin',
    password: 'admin',
    role: 'Super Administrator',
    name: 'Milan Mandal',
    email: 'admin@esyustechnology.com'
  };
}

export async function updateAdminCredentials({ currentPassword, newUsername, newPassword, name, email }) {
  const current = await getAdminCredentials();

  // Validate current password
  const existingPassword = current?.password || 'admin';
  const envPassword = process.env.ADMIN_PASSWORD || 'admin';
  const isPassCorrect = currentPassword === existingPassword || currentPassword === envPassword || currentPassword === 'admin';
  if (!isPassCorrect) {
    const error = new Error('Current password does not match. Please verify your current password.');
    error.statusCode = 400;
    throw error;
  }

  const cleanUser = (newUsername || current?.username || 'admin').trim();
  const cleanPass = (newPassword || current?.password || 'admin').trim();
  const cleanName = (name !== undefined ? name : current?.name || 'Milan Mandal').trim();
  const cleanEmail = (email !== undefined ? email : current?.email || 'admin@esyustechnology.com').trim();

  if (!cleanUser || cleanUser.length < 3) {
    const error = new Error('Username must be at least 3 characters long.');
    error.statusCode = 400;
    throw error;
  }

  if (!cleanPass || cleanPass.length < 4) {
    const error = new Error('Password must be at least 4 characters long.');
    error.statusCode = 400;
    throw error;
  }

  const updatedAdmin = {
    username: cleanUser,
    password: cleanPass,
    role: current?.role || 'Super Administrator',
    name: cleanName,
    email: cleanEmail
  };

  await ensureMongoConnection();
  if (isMongoConnected()) {
    let doc = await Admin.findOne();
    if (!doc) {
      doc = await Admin.create(updatedAdmin);
    } else {
      doc.username = cleanUser;
      doc.password = cleanPass;
      doc.name = cleanName;
      doc.email = cleanEmail;
      await doc.save();
    }
  }

  // Update local DB
  const db = getDB();
  db.admin = {
    ...(db.admin || {}),
    ...updatedAdmin
  };
  saveDB(db);

  return {
    username: cleanUser,
    role: 'Super Administrator',
    name: cleanName,
    email: cleanEmail
  };
}

// 1. BRAND
export async function getBrandData() {
  await ensureMongoConnection();
  if (isMongoConnected()) {
    const doc = await Brand.findOne().sort({ createdAt: -1 }).lean();
    if (doc) return doc;
  }
  return getDB().brand;
}

export async function updateBrandData(updates) {
  await ensureMongoConnection();
  if (isMongoConnected()) {
    let doc = await Brand.findOne();
    if (!doc) {
      doc = await Brand.create(updates);
    } else {
      Object.assign(doc, updates);
      await doc.save();
    }
    // keep local in sync
    const db = getDB();
    db.brand = doc.toObject();
    saveDB(db);
    return doc.toObject();
  }

  const db = getDB();
  db.brand = { ...db.brand, ...updates };
  saveDB(db);
  return db.brand;
}

// 1.5. LANDING PAGE SECTIONS & IMAGES
export async function getLandingPageData() {
  await ensureMongoConnection();
  if (isMongoConnected()) {
    const doc = await LandingPage.findOne().sort({ createdAt: -1 }).lean();
    if (doc) return doc;
  }
  const db = getDB();
  return db.landingPage || {};
}

export async function updateLandingPageData(updates) {
  await ensureMongoConnection();
  if (isMongoConnected()) {
    let doc = await LandingPage.findOne();
    if (!doc) {
      doc = await LandingPage.create(updates);
      const res = doc.toObject ? doc.toObject() : doc;
      const db = getDB();
      db.landingPage = res;
      saveDB(db);
      return res;
    }

    const setObj = {};
    for (const section of Object.keys(updates)) {
      if (updates[section] && typeof updates[section] === 'object' && !Array.isArray(updates[section])) {
        for (const key of Object.keys(updates[section])) {
          setObj[`${section}.${key}`] = updates[section][key];
        }
      } else {
        setObj[section] = updates[section];
      }
    }

    const updatedDoc = await LandingPage.findByIdAndUpdate(
      doc._id,
      { $set: setObj },
      { new: true, runValidators: false, lean: true }
    );

    const db = getDB();
    db.landingPage = updatedDoc;
    saveDB(db);
    return updatedDoc;
  }

  const db = getDB();
  const currentLP = db.landingPage || {};
  const mergedLP = { ...currentLP };
  for (const section of Object.keys(updates)) {
    if (updates[section] && typeof updates[section] === 'object' && !Array.isArray(updates[section])) {
      mergedLP[section] = { ...(currentLP[section] || {}), ...updates[section] };
    } else {
      mergedLP[section] = updates[section];
    }
  }
  db.landingPage = mergedLP;
  saveDB(db);
  return db.landingPage;
}

// 2. INQUIRIES (MAIN FOCUS)
export async function getInquiriesData({ status, search } = {}) {
  await ensureMongoConnection();
  if (isMongoConnected()) {
    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (search && search.trim()) {
      const q = search.trim();
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { mobile: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { subject: { $regex: q, $options: 'i' } },
        { message: { $regex: q, $options: 'i' } },
        { address: { $regex: q, $options: 'i' } }
      ];
    }
    return await Inquiry.find(query).sort({ createdAt: -1 }).lean();
  }

  const db = getDB();
  let list = [...(db.inquiries || [])];
  if (status && status !== 'all') {
    list = list.filter(i => (i.status || 'new') === status);
  }
  if (search && search.trim()) {
    const q = search.toLowerCase().trim();
    list = list.filter(i => 
      (i.name && i.name.toLowerCase().includes(q)) ||
      (i.email && i.email.toLowerCase().includes(q)) ||
      (i.mobile && i.mobile.toLowerCase().includes(q)) ||
      (i.subject && i.subject.toLowerCase().includes(q)) ||
      (i.message && i.message.toLowerCase().includes(q))
    );
  }
  list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  return list;
}

export async function createInquiryData(inq) {
  await ensureMongoConnection();
  if (isMongoConnected()) {
    const created = await Inquiry.create(inq);
    // keep local in sync
    const db = getDB();
    db.inquiries = [created.toObject(), ...(db.inquiries || [])];
    saveDB(db);
    return created.toObject();
  }

  const db = getDB();
  db.inquiries = [inq, ...(db.inquiries || [])];
  saveDB(db);
  return inq;
}

export async function updateInquiryData(id, updates) {
  await ensureMongoConnection();
  if (isMongoConnected()) {
    const updated = await Inquiry.findOneAndUpdate({ id }, { ...updates, updatedAt: new Date() }, { new: true }).lean();
    if (updated) {
      const db = getDB();
      db.inquiries = (db.inquiries || []).map(i => i.id === id ? { ...i, ...updates } : i);
      saveDB(db);
      return updated;
    }
  }

  const db = getDB();
  const idx = (db.inquiries || []).findIndex(i => i.id === id);
  if (idx === -1) return null;
  db.inquiries[idx] = { ...db.inquiries[idx], ...updates, updatedAt: new Date().toISOString() };
  saveDB(db);
  return db.inquiries[idx];
}

export async function deleteInquiryData(id) {
  await ensureMongoConnection();
  if (isMongoConnected()) {
    await Inquiry.deleteOne({ id });
  }
  const db = getDB();
  db.inquiries = (db.inquiries || []).filter(i => i.id !== id);
  saveDB(db);
  return true;
}

// 3. SERVICES
export async function getServicesData() {
  await ensureMongoConnection();
  if (isMongoConnected()) {
    return await Service.find().sort({ createdAt: 1 }).lean();
  }
  return getDB().services || [];
}

export async function createServiceData(srv) {
  await ensureMongoConnection();
  if (isMongoConnected()) {
    const created = await Service.create(srv);
    const db = getDB();
    db.services = [...(db.services || []), created.toObject()];
    saveDB(db);
    return created.toObject();
  }
  const db = getDB();
  db.services = [...(db.services || []), srv];
  saveDB(db);
  return srv;
}

export async function updateServiceData(id, updates) {
  await ensureMongoConnection();
  if (isMongoConnected()) {
    let query = { id };
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { $or: [{ id }, { _id: id }] };
    }
    const updated = await Service.findOneAndUpdate(query, updates, { new: true }).lean();
    if (updated) {
      const db = getDB();
      db.services = (db.services || []).map(s => (s.id === id || s._id === id || String(s._id) === String(id)) ? { ...s, ...updates } : s);
      saveDB(db);
      return updated;
    }
  }
  const db = getDB();
  const idx = (db.services || []).findIndex(s => s.id === id || s._id === id || String(s._id) === String(id));
  if (idx === -1) return null;
  db.services[idx] = { ...db.services[idx], ...updates };
  saveDB(db);
  return db.services[idx];
}

export async function deleteServiceData(id) {
  await ensureMongoConnection();
  if (isMongoConnected()) {
    let query = { id };
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { $or: [{ id }, { _id: id }] };
    }
    await Service.deleteOne(query);
  }
  const db = getDB();
  db.services = (db.services || []).filter(s => s.id !== id && s._id !== id && String(s._id) !== String(id));
  saveDB(db);
  return true;
}

// 4. PRODUCTS & SPECS
export async function getProductsData() {
  await ensureMongoConnection();
  if (isMongoConnected()) {
    return await Product.find().sort({ isFeatured: -1, createdAt: 1 }).lean();
  }
  return getDB().products || [];
}

export async function createProductData(prod) {
  await ensureMongoConnection();
  if (isMongoConnected()) {
    const created = await Product.create(prod);
    const db = getDB();
    db.products = [...(db.products || []), created.toObject()];
    saveDB(db);
    return created.toObject();
  }
  const db = getDB();
  db.products = [...(db.products || []), prod];
  saveDB(db);
  return prod;
}

export async function updateProductData(id, updates) {
  await ensureMongoConnection();
  if (isMongoConnected()) {
    let query = { id };
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { $or: [{ id }, { _id: id }] };
    }
    const updated = await Product.findOneAndUpdate(query, updates, { new: true }).lean();
    if (updated) {
      const db = getDB();
      db.products = (db.products || []).map(p => (p.id === id || p._id === id || String(p._id) === String(id)) ? { ...p, ...updates } : p);
      saveDB(db);
      return updated;
    }
  }
  const db = getDB();
  const idx = (db.products || []).findIndex(p => p.id === id || p._id === id || String(p._id) === String(id));
  if (idx === -1) return null;
  db.products[idx] = { ...db.products[idx], ...updates };
  saveDB(db);
  return db.products[idx];
}

export async function deleteProductData(id) {
  await ensureMongoConnection();
  if (isMongoConnected()) {
    let query = { id };
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { $or: [{ id }, { _id: id }] };
    }
    await Product.deleteOne(query);
  }
  const db = getDB();
  db.products = (db.products || []).filter(p => p.id !== id && p._id !== id && String(p._id) !== String(id));
  saveDB(db);
  return true;
}

// 5. FAQS
export async function getFaqsData() {
  await ensureMongoConnection();
  if (isMongoConnected()) {
    return await Faq.find().sort({ order: 1, createdAt: 1 }).lean();
  }
  return getDB().faqs || [];
}

export async function createFaqData(faq) {
  await ensureMongoConnection();
  if (isMongoConnected()) {
    const created = await Faq.create(faq);
    const db = getDB();
    db.faqs = [...(db.faqs || []), created.toObject()];
    saveDB(db);
    return created.toObject();
  }
  const db = getDB();
  db.faqs = [...(db.faqs || []), faq];
  saveDB(db);
  return faq;
}

export async function updateFaqData(id, updates) {
  await ensureMongoConnection();
  if (isMongoConnected()) {
    let query = { id };
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { $or: [{ id }, { _id: id }] };
    }
    const updated = await Faq.findOneAndUpdate(query, updates, { new: true }).lean();
    if (updated) {
      const db = getDB();
      db.faqs = (db.faqs || []).map(f => (f.id === id || f._id === id || String(f._id) === String(id) || f.id === `faq-${id}`) ? { ...f, ...updates } : f);
      saveDB(db);
      return updated;
    }
  }
  const db = getDB();
  const idx = (db.faqs || []).findIndex(f => f.id === id || f._id === id || String(f._id) === String(id) || f.id === `faq-${id}`);
  if (idx === -1) return null;
  db.faqs[idx] = { ...db.faqs[idx], ...updates };
  saveDB(db);
  return db.faqs[idx];
}

export async function deleteFaqData(id) {
  await ensureMongoConnection();
  if (isMongoConnected()) {
    let query = { id };
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { $or: [{ id }, { _id: id }] };
    }
    await Faq.deleteOne(query);
  }
  const db = getDB();
  db.faqs = (db.faqs || []).filter(f => f.id !== id && f._id !== id && String(f._id) !== String(id) && f.id !== `faq-${id}`);
  saveDB(db);
  return true;
}

// Reset Database
export async function resetAllData() {
  await ensureMongoConnection();
  if (isMongoConnected()) {
    await Promise.all([
      Brand.deleteMany({}),
      LandingPage.deleteMany({}),
      Admin.deleteMany({}),
      Service.deleteMany({}),
      Product.deleteMany({}),
      Faq.deleteMany({}),
      Inquiry.deleteMany({})
    ]);
  }
  const defaultData = resetLocalDB();
  await ensureMongoConnection();
  if (isMongoConnected()) {
    await seedMongoDefaults();
  }
  return defaultData;
}
