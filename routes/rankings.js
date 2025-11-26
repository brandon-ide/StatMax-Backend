import express from "express";
import User from "../models/User.js";
import Session from "../models/Session.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    const sessions = await Session.find();

    const totals = {};
    users.forEach((u) => {
      totals[u._id] = {
        _id: u._id.toString(),
        username: u.username,
        points: 0,
        rebounds: 0,
        assists: 0,
        blocks: 0,
        steals: 0,
      };
    });

    sessions.forEach((session) => {
      const uid = session.user;
      const s = session.stats;

      if (!totals[uid]) return;

      totals[uid].points += s.points || 0;
      totals[uid].rebounds += s.rebounds || 0;
      totals[uid].assists += s.assists || 0;
      totals[uid].blocks += s.blocks || 0;
      totals[uid].steals += s.steals || 0;
    });

    const list = Object.values(totals);

    const rankings = {
      points: [...list].sort((a, b) => b.points - a.points),
      rebounds: [...list].sort((a, b) => b.rebounds - a.rebounds),
      assists: [...list].sort((a, b) => b.assists - a.assists),
      blocks: [...list].sort((a, b) => b.blocks - a.blocks),
      steals: [...list].sort((a, b) => b.steals - a.steals),
    };

    res.json(rankings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load rankings" });
  }
});

export default router;
