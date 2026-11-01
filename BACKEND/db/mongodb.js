import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Brand } from '../models/Brand.js';
import { Service } from '../models/Service.js';
import { Product } from '../models/Product.js';
import { Faq } from '../models/Faq.js';
import { Inquiry } from '../models/Inquiry.js';
import { LandingPage } from '../models/LandingPage.js';
import { getDB, saveDB, resetDB as resetLocalDB } from '../db.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/esyus_db';

let isConnected = false;

export async function connectMongoDB() {
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 2000
    });
    isConnected = true;
    console.log(`[MERN: MongoDB] Connected to MongoDB database: ${conn.connection.name}`);
    
    // Seed initial data if collections are empty
    await seedMongoDefaults();
    return true;
  } catch (err) {
    isConnected = false;
    console.warn(`[MERN: MongoDB] Could not reach MongoDB at ${MONGODB_URI} (${err.message}).`);
    console.warn(`[MERN: MongoDB] Seamlessly operating with persistent local cache. To use MongoDB Atlas, paste your connection string in BACKEND/.env`);
    return false;
  }
}

export function isMongoConnected() {
  return isConnected && mongoose.connection.readyState === 1;
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
  } catch (e) {
    console.error('[MERN: MongoDB] Seed error:', e.message);
  }
}

// ==============================================
// Unified Store API (Mongoose with fallback)
// ==============================================

// 1. BRAND
export async function getBrandData() {
  if (isMongoConnected()) {
    const doc = await Brand.findOne().sort({ createdAt: -1 }).lean();
    if (doc) return doc;
  }
  return getDB().brand;
}

export async function updateBrandData(updates) {
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
  if (isMongoConnected()) {
    const doc = await LandingPage.findOne().sort({ createdAt: -1 }).lean();
    if (doc) return doc;
  }
  const db = getDB();
  return db.landingPage || {};
}

export async function updateLandingPageData(updates) {
  if (isMongoConnected()) {
    let doc = await LandingPage.findOne();
    if (!doc) {
      doc = await LandingPage.create(updates);
    } else {
      Object.assign(doc, updates);
      await doc.save();
    }
    const db = getDB();
    db.landingPage = doc.toObject();
    saveDB(db);
    return doc.toObject();
  }

  const db = getDB();
  db.landingPage = { ...(db.landingPage || {}), ...updates };
  saveDB(db);
  return db.landingPage;
}

// 2. INQUIRIES (MAIN FOCUS)
export async function getInquiriesData({ status, search } = {}) {
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
  if (isMongoConnected()) {
    return await Service.find().sort({ createdAt: 1 }).lean();
  }
  return getDB().services || [];
}

export async function createServiceData(srv) {
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
  if (isMongoConnected()) {
    const updated = await Service.findOneAndUpdate({ id }, updates, { new: true }).lean();
    if (updated) {
      const db = getDB();
      db.services = (db.services || []).map(s => s.id === id ? { ...s, ...updates } : s);
      saveDB(db);
      return updated;
    }
  }
  const db = getDB();
  const idx = (db.services || []).findIndex(s => s.id === id);
  if (idx === -1) return null;
  db.services[idx] = { ...db.services[idx], ...updates };
  saveDB(db);
  return db.services[idx];
}

export async function deleteServiceData(id) {
  if (isMongoConnected()) {
    await Service.deleteOne({ id });
  }
  const db = getDB();
  db.services = (db.services || []).filter(s => s.id !== id);
  saveDB(db);
  return true;
}

// 4. PRODUCTS & SPECS
export async function getProductsData() {
  if (isMongoConnected()) {
    return await Product.find().sort({ isFeatured: -1, createdAt: 1 }).lean();
  }
  return getDB().products || [];
}

export async function createProductData(prod) {
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
  if (isMongoConnected()) {
    const updated = await Product.findOneAndUpdate({ id }, updates, { new: true }).lean();
    if (updated) {
      const db = getDB();
      db.products = (db.products || []).map(p => p.id === id ? { ...p, ...updates } : p);
      saveDB(db);
      return updated;
    }
  }
  const db = getDB();
  const idx = (db.products || []).findIndex(p => p.id === id);
  if (idx === -1) return null;
  db.products[idx] = { ...db.products[idx], ...updates };
  saveDB(db);
  return db.products[idx];
}

export async function deleteProductData(id) {
  if (isMongoConnected()) {
    await Product.deleteOne({ id });
  }
  const db = getDB();
  db.products = (db.products || []).filter(p => p.id !== id);
  saveDB(db);
  return true;
}

// 5. FAQS
export async function getFaqsData() {
  if (isMongoConnected()) {
    return await Faq.find().sort({ order: 1, createdAt: 1 }).lean();
  }
  return getDB().faqs || [];
}

export async function createFaqData(faq) {
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
  if (isMongoConnected()) {
    const updated = await Faq.findOneAndUpdate({ id }, updates, { new: true }).lean();
    if (updated) {
      const db = getDB();
      db.faqs = (db.faqs || []).map(f => (f.id === id || f.id === `faq-${id}`) ? { ...f, ...updates } : f);
      saveDB(db);
      return updated;
    }
  }
  const db = getDB();
  const idx = (db.faqs || []).findIndex(f => f.id === id || f.id === `faq-${id}`);
  if (idx === -1) return null;
  db.faqs[idx] = { ...db.faqs[idx], ...updates };
  saveDB(db);
  return db.faqs[idx];
}

export async function deleteFaqData(id) {
  if (isMongoConnected()) {
    await Faq.deleteOne({ id });
  }
  const db = getDB();
  db.faqs = (db.faqs || []).filter(f => f.id !== id && f.id !== `faq-${id}`);
  saveDB(db);
  return true;
}

// Reset Database
export async function resetAllData() {
  if (isMongoConnected()) {
    await Promise.all([
      Brand.deleteMany({}),
      Service.deleteMany({}),
      Product.deleteMany({}),
      Faq.deleteMany({}),
      Inquiry.deleteMany({})
    ]);
  }
  const defaultData = resetLocalDB();
  if (isMongoConnected()) {
    await seedMongoDefaults();
  }
  return defaultData;
}
