import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    default: 'admin',
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    default: 'admin'
  },
  role: {
    type: String,
    default: 'Super Administrator'
  },
  name: {
    type: String,
    default: 'Milan Mandal'
  },
  email: {
    type: String,
    default: 'admin@esyustechnology.com'
  }
}, { timestamps: true });

export const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
export default Admin;

