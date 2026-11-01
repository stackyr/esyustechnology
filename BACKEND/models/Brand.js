import mongoose from 'mongoose';

const StatSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true },
  desc: { type: String, default: '' }
}, { _id: false });

const BrandSchema = new mongoose.Schema({
  name: { type: String, required: true, default: 'Esyus Technologies' },
  shortName: { type: String, default: 'Esyus' },
  domain: { type: String, default: 'esyustechnologies.com' },
  tagline: { type: String, default: "Smart Software Solutions for Tomorrow's Businesses" },
  slogan: { type: String, default: 'High-Performance Desktop, Web & Android Systems Built for Absolute Reliability' },
  founder: { type: String, default: 'Milan Mandal' },
  coFounder: { type: String, default: 'Suman Raptan' },
  establishmentDate: { type: String, default: '01/01/2027' },
  email: { type: String, default: 'contact@esyustechnologies.com' },
  supportEmail: { type: String, default: 'support@esyustechnologies.com' },
  phone: { type: String, default: '+91 98765 43210' },
  address: { type: String, default: 'Esyus Technologies Tech Park, Sector V, Bidhannagar, Kolkata, West Bengal 700091' },
  stats: [StatSchema]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export const Brand = mongoose.models.Brand || mongoose.model('Brand', BrandSchema);
export default Brand;
