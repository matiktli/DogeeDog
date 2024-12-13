import mongoose from 'mongoose'

const dogSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  breed: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female']
  },
  description: {
    type: String,
    maxLength: 500,
    default: ''
  },
  imageUrl: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export const Dog = mongoose.models.Dog || mongoose.model('Dog', dogSchema) 