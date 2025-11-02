import Session from '../models/Session.js';

export const createSession = async (req, res) => {
  try {
    const session = await Session.create({
      user: req.user._id,
      mode: req.body.mode,
      stats: req.body.stats
    });
    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user._id }).sort({ date: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    if (session.user.toString() !== req.user._id.toString())
      return res.status(401).json({ message: 'Not authorized' });

    session.mode = req.body.mode || session.mode;
    session.stats = req.body.stats || session.stats;
    await session.save();

    res.json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    if (session.user.toString() !== req.user._id.toString())
      return res.status(401).json({ message: 'Not authorized' });

    await session.remove();
    res.json({ message: 'Session removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
