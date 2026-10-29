import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, default: 'Desktop Billing' },
  platform: { type: String, default: 'Windows 10 / 11' },
  version: { type: String, default: 'v1.0.0' },
  size: { type: String, default: '25.0 MB' },
  isFeatured: { type: Boolean, default: false },
  tagline: { type: String, default: '' },
  description: { type: String, default: '' },
  highlights: [{ type: String }],
  downloadFile: { type: String, default: 'Setup.exe' },
  accentColor: { type: String, default: 'from-blue-600 to-indigo-700' },
  badge: { type: String, default: 'Desktop App' }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
export default Product;
