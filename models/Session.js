import mongoose from 'mongoose';

const statsSchema = new mongoose.Schema({
  points: { type: Number, default: 0, min: 0 },
  assists: { type: Number, default: 0, min: 0 },
  rebounds: { type: Number, default: 0, min: 0 },
  steals: { type: Number, default: 0, min: 0 },
  blocks: { type: Number, default: 0, min: 0 },
  turnovers: { type: Number, default: 0, min: 0 },
  shotsMade: { type: Number, default: 0, min: 0 },
  shotsAttempted: { type: Number, default: 0, min: 0 },
  shootingPercentage: { type: Number, default: 0 },
});

const sessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  mode: {
    type: String,
    enum: ['Official Game', 'Pickup Game', 'Practice', 'Shooting Drill'],
    required: [true, 'Mode is required']
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  stats: {
    type: statsSchema,
    default: () => ({})
  }
});

export default mongoose.model('Session', sessionSchema);
