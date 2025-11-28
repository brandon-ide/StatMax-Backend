import express from "express";
import Session from "../models/Session.js";
import { protect as authMiddleware } from "../middleware/authMiddleware.js";
import openai from "../config/openai.js";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;

    const sessions = await Session.find({ user: userId });

    const totals = sessions.reduce(
      (acc, s) => {
        acc.points += s.stats.points || 0;
        acc.rebounds += s.stats.rebounds || 0;
        acc.assists += s.stats.assists || 0;
        acc.blocks += s.stats.blocks || 0;
        acc.steals += s.stats.steals || 0;
        return acc;
      },
      { points: 0, rebounds: 0, assists: 0, blocks: 0, steals: 0 }
    );

    const prompt = `
You are StatMax AI Coach. Your name is Max.
You ONLY talk about basketball training and performance — nothing else.

Here is the user's full performance history:

Totals:
- Points: ${totals.points}
- Rebounds: ${totals.rebounds}
- Assists: ${totals.assists}
- Blocks: ${totals.blocks}
- Steals: ${totals.steals}

Recent Sessions:
${sessions.map(s => `- ${s.date}: ${JSON.stringify(s.stats)}`).join("\n")}

User asks: "${message}"

Give feedback that is:
- motivational
- actionable
- based ONLY on real stats
- short + useful
- NO medical advice
`;

    const aiRes = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "You are Max, the StatMax AI basketball coach." },
        { role: "user", content: prompt }
      ],
    });

    res.json({ reply: aiRes.choices[0].message.content });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "AI coach error" });
  }
});

export default router;
