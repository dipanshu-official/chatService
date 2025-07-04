import express from "express";
import cors from "cors";
import { config } from "dotenv";

config(); // Load .env variables

const app = express();

app.use(cors());
app.use(express.json());

// Example route
app.get("/", (req, res) => {
  res.send("Chat App API is running");
});

export default app;
