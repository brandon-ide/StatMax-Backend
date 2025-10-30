import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  mode: {
    type: String,
    enum: ['official', 'pickup', 'practice', 'drill'],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  stats: {
    points: { type: Number, default: 0 },
    assists: { type: Number, default: 0 },
    rebounds: { type: Number, default: 0 },
    steals: { type: Number, default: 0 },
    blocks: { type: Number, default: 0 },
    turnovers: { type: Number, default: 0 },
    shotsMade: { type: Number, default: 0 },
    shotsAttempted: { type: Number, default: 0 },
  },
});

const Session = mongoose.model('Session', sessionSchema);
export default Session;
