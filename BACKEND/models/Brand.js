import mongoose from 'mongoose';

const StatSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true },
  desc: { type: String, default: '' }
}, { _id: false });

const BrandSchema = new mongoose.Schema({
  name: { type: String, required: true, default: 'Esyus Technology' },
  shortName: { type: String, default: 'Esyus' },
  domain: { type: String, default: 'esyustechnology.com' },
  tagline: { type: String, default: "Smart Software Solutions for Tomorrow's Businesses" },
  slogan: { type: String, default: 'High-Performance Desktop, Web & Android Systems Built for Absolute Reliability' },
  founder: { type: String, default: 'Sayantan Ghosh' },
  coFounder: { type: String, default: 'Soham Dutta' },
  establishmentDate: { type: String, default: '01/01/2027' },
  email: { type: String, default: 'contact@esyustechnology.com' },
  supportEmail: { type: String, default: 'support@esyustechnology.com' },
  phone: { type: String, default: '+91 98765 43210' },
  address: { type: String, default: 'Burdwan, West Bengal 70045' },
  navBadge: { type: String, default: 'Software' },
  navSubtitle: { type: String, default: 'Enterprise Suite' },
  footerAbout: { type: String, default: 'Esyus Technology builds robust, high-performance desktop suites, enterprise web platforms, and tailored Android applications designed to operate with absolute reliability and speed.' },
  stats: [StatSchema]
}, {
  timestamps: true,
  strict: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export const Brand = mongoose.models.Brand || mongoose.model('Brand', BrandSchema);
export default Brand;
