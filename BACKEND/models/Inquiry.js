import mongoose from 'mongoose';

const InquirySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  mobile: { type: String, default: '' },
  email: { type: String, default: '' },
  address: { type: String, default: '' },
  subject: { type: String, default: 'General Inquiry' },
  message: { type: String, default: '' },
  type: { type: String, enum: ['enquiry', 'subscription', 'feedback', 'general'], default: 'enquiry' },
  status: { type: String, enum: ['new', 'in_progress', 'resolved', 'archived'], default: 'new' },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);
export default Inquiry;
