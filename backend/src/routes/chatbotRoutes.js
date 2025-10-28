import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const intentsPath = path.join(process.cwd(), "intents.json");

router.get("/intents", (req, res) => {
  try {
    const data = fs.readFileSync(intentsPath, "utf-8");
    res.json(JSON.parse(data));
  } catch {
    res.status(500).json({ message: "Failed to load intents" });
  }
});

export default router;
