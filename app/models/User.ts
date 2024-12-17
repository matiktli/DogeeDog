import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: false,
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
  googleId: {
    type: String,
    sparse: true,
    unique: true,
  },
  provider: {
    type: String,
    enum: ['credentials', 'google'],
    default: 'credentials'
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

userSchema.index({ googleId: 1 }, { sparse: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User; 