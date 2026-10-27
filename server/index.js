import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/analyze-mood", async (req, res) => {
  try {
    const { journal } = req.body;

    if (!journal) {
      return res.status(400).json({
        error: "Journal is required",
      });
    }

    const response = await openai.responses.create({
      model: "gpt-5-nano",
      input: `
You are an emotion classification assistant.

Choose exactly TWO emotions from the following 70 emotions.

[Positive & Energized]
Happy, Excited, Joyful, Thrilled, Ecstatic, Euphoric, Enthusiastic, Passionate, Energetic, Inspired

[Peaceful & Fulfilling]
Calm, Relaxed, Peaceful, Content, Serene, Grateful, Touched, Loved, Nostalgic, Relieved

[Empowered & Ambitious]
Hopeful, Confident, Proud, Determined, Motivated, Ambitious, Accomplished, Courageous, Heroic, Triumphant

[Sadness & Isolation]
Sad, Lonely, Heartbroken, Gloomy, Melancholy, Hopeless, Desperate, Empty, Hurt, Depressed

[Fear & Anxiety]
Anxious, Worried, Nervous, Panicked, Terrified, Overwhelmed, Stressed, Insecure, Vulnerable, Restless

[Anger & Aversion]
Angry, Frustrated, Annoyed, Irritated, Furious, Resentful, Bitter, Disgusted, Jealous, Envious

[Disappointment & Guilt]
Disappointed, Guilty, Ashamed, Regretful, Embarrassed, Betrayed, Rejected, Helpless, Defeated

[Confusion & Apathy]
Bored, Confused, Indifferent, Apathetic, Skeptical, Suspicious, Exhausted, Drained, Shocked, Surprised

Choose:
1. The primary emotion — the emotion that best represents the user's overall feeling.
2. The secondary emotion — another emotion that is clearly present in the journal.

Return ONLY the two emotion names, separated by a comma.

Example:
Disappointed, Worried

Journal:
${journal}
      `,
    });

    const emotion = response.output_text.trim();

    console.log("AI emotion:", emotion);

    res.json({
      emotion,
    });
    console.log("Usage:", response.usage);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to analyze mood",
    });
  }
});

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});