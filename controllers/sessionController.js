import Session from '../models/Session.js';
import User from '../models/User.js';

// Helper to enhance session for frontend
const enhanceSession = (session) => ({
  _id: session._id,
  title: session.title,
  mode: session.mode,
  date: session.date.toISOString(),
  stats: session.stats,
  user: session.user ? { _id: session.user._id, username: session.user.username, email: session.user.email } : null,
  shootingPercentage: session.stats.shotsAttempted
    ? (session.stats.shotsMade / session.stats.shotsAttempted) * 100
    : 0,
});

export const createSession = async (req, res) => {
  try {
    const { title, mode, stats } = req.body;

    const session = await Session.create({
      user: req.user._id,
      title,
      mode,
      stats,
    });

    await session.populate('user', 'username email');

    res.status(201).json(enhanceSession(session));
  } catch (err) {
    console.error('Create session error:', err);
    res.status(500).json({ message: 'Server error creating session' });
  }
};

export const getSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user._id })
      .populate('user', 'username email')
      .sort({ date: -1 });

    res.json(sessions.map(enhanceSession));
  } catch (err) {
    console.error('Fetch sessions error:', err);
    res.status(500).json({ message: 'Server error fetching sessions' });
  }
};

export const updateSession = async (req, res) => {
    try {
      const session = await Session.findOne({ _id: req.params.id, user: req.user._id });
      if (!session) return res.status(404).json({ message: 'Session not found' });
  
      const { title, mode, stats } = req.body;
  
      if (title) session.title = title;
      if (mode) session.mode = mode;
  
      if (stats) {
        Object.keys(stats).forEach(key => {
          if (session.stats[key] !== undefined) {
            session.stats[key] = stats[key];
          }
        });
      }
  
      await session.save();
      await session.populate('user', 'username email');
  
      res.json(enhanceSession(session));
    } catch (err) {
      console.error('Update session error:', err);
      res.status(500).json({ message: 'Server error updating session' });
    }
  };  
  
export const deleteSession = async (req, res) => {
  try {
    const session = await Session.findOne({ _id: req.params.id, user: req.user._id });
    if (!session) return res.status(404).json({ message: 'Session not found' });

    await session.deleteOne();
    res.json({ message: 'Session deleted successfully' });
  } catch (err) {
    console.error('Delete session error:', err);
    res.status(500).json({ message: 'Server error deleting session' });
  }
};
