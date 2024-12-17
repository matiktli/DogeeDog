import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: null
  },
  imageUrl: {
    type: String,
    default: null,
  },
  emailConfirmed: {
    type: Boolean,
    default: false,
  },
  payment: {
    priceId: String,
    customerId: String,
    hasAccess: Boolean,
    paidAt: Date,
    cancelledAt: Date
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  strict: true,
  timestamps: true
});

// Check if the model exists before creating a new one
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User; 