import mongoose from 'mongoose';

const FaqSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  q: { type: String, required: true },
  a: { type: String, required: true },
  order: { type: Number, default: 0 }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export const Faq = mongoose.models.Faq || mongoose.model('Faq', FaqSchema);
export default Faq;
