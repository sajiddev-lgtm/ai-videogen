import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// 🔥 MULTI API SYSTEM
async function generateVideo(prompt) {

  // 🥇 ZSKY
  try {
    const res = await axios.post(
      "https://api.zsky.ai/v1/video/generate",
      { prompt, duration: 5 },
      {
        headers: {
          Authorization: `Bearer ${process.env.ZSKY_API_KEY}`
        }
      }
    );
    return res.data.video_url;
  } catch (e) {
    console.log("ZSky failed");
  }

  // 🥈 FAL
  try {
    const res = await axios.post(
      "https://fal.run/video",
      { prompt },
      {
        headers: {
          Authorization: `Key ${process.env.FAL_API_KEY}`
        }
      }
    );
    return res.data.video?.url;
  } catch (e) {
    console.log("fal failed");
  }

  // 🥉 FALLBACK (offline demo)
  return "https://samplelib.com/lib/preview/mp4/sample-5s.mp4";
}

// API route
app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;
    const video = await generateVideo(prompt);
    res.json({ video_url: video });
  } catch (err) {
    res.status(500).json({ error: "failed" });
  }
});

app.listen(3000, () => console.log("Server running on 3000"));