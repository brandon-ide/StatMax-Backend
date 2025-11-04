import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Session from '../models/Session.js';

const router = express.Router();

router.post('/', protect, async (req, res) => {
  const session = await Session.create({ ...req.body, user: req.user._id });
  res.status(201).json(session);
});

router.get('/', protect, async (req, res) => {
  const sessions = await Session.find({ user: req.user._id });
  res.json(sessions);
});

router.put('/:id', protect, async (req, res) => {
  const session = await Session.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true }
  );
  if (!session) return res.status(404).json({ message: 'Not found' });
  res.json(session);
});

router.delete('/:id', protect, async (req, res) => {
  const session = await Session.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!session) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
});

export default router;
