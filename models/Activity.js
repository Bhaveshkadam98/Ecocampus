// models/Activity.js
import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  description: String,
  location: {
    lat: Number,
    lng: Number,
    placeName: String,
  },
  images: [String],
  points: Number,
  carbonSavedEstimateKg: Number,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  adminComment: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  approvedAt: Date,
});

export default mongoose.models.Activity || mongoose.model('Activity', ActivitySchema);