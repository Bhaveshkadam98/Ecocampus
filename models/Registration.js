// models/Registration.js
import mongoose from 'mongoose';

const RegistrationSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'declined', 'waitlisted', 'checked-in', 'no-show'],
    default: 'pending',
  },
  registeredAt: {
    type: Date,
    default: Date.now,
  },
  approvedAt: Date,
  checkedInAt: Date,
  notes: String,
  skills: [String],
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String,
  },
  dietaryRestrictions: String,
  tshirtSize: {
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  },
  volunteerRole: String,
  pointsAwarded: {
    type: Number,
    default: 0,
  },
  pointsAwardedAt: Date,
  adminComment: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Compound index to prevent duplicate registrations
RegistrationSchema.index({ event: 1, user: 1 }, { unique: true });

// Indexes for efficient queries
RegistrationSchema.index({ event: 1, status: 1 });
RegistrationSchema.index({ user: 1, status: 1 });
RegistrationSchema.index({ registeredAt: 1 });

export default mongoose.models.Registration || mongoose.model('Registration', RegistrationSchema);