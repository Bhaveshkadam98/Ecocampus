// models/Event.js
import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
  },
  location: {
    address: String,
    placeName: String,
    lat: Number,
    lng: Number,
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  maxParticipants: {
    type: Number,
    required: true,
    min: 1,
  },
  registrationDeadline: {
    type: Date,
  },
  pointsReward: {
    type: Number,
    default: 0,
    min: 0,
  },
  carbonSavedEstimateKg: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    enum: ['tree-planting', 'cleanup', 'workshop', 'collection-drive', 'competition', 'awareness', 'other'],
    default: 'other',
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'completed'],
    default: 'draft',
  },
  autoApproveRegistrations: {
    type: Boolean,
    default: true,
  },
  requiresSkills: [String],
  images: [String],
  attachments: [{
    name: String,
    url: String,
    type: String,
  }],
  tags: [String],
  requirements: String,
  whatToBring: String,
  contactInfo: {
    email: String,
    phone: String,
  },
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

// Virtual for registration count
EventSchema.virtual('registrationCount', {
  ref: 'Registration',
  localField: '_id',
  foreignField: 'event',
  count: true,
});

// Virtual for approved registration count
EventSchema.virtual('approvedRegistrationCount', {
  ref: 'Registration',
  localField: '_id',
  foreignField: 'event',
  match: { status: 'approved' },
  count: true,
});

EventSchema.set('toJSON', { virtuals: true });
EventSchema.set('toObject', { virtuals: true });

// Index for efficient queries
EventSchema.index({ date: 1, status: 1 });
EventSchema.index({ organizer: 1 });
EventSchema.index({ category: 1, status: 1 });

export default mongoose.models.Event || mongoose.model('Event', EventSchema);