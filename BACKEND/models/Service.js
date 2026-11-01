import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  shortDesc: { type: String, default: '' },
  fullDesc: { type: String, default: '' },
  badge: { type: String, default: 'Core Service' },
  iconName: { type: String, default: 'Globe' },
  features: [{ type: String }],
  techStack: [{ type: String }],
  isComingSoon: { type: Boolean, default: false },
  actionUrl: { type: String, default: '' },
  image: { type: String, default: '' },
  num: { type: String, default: '' }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema);
export default Service;
