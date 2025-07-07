import express from "express";
import cors from "cors";
import { config } from "dotenv";
import userRoute from "./routes/user.route.js";

config(); // Load .env variables

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // <-- React app origin
  })
);
app.use(express.json());

// Example route
app.get("/", (req, res) => {
  res.send("Chat App API is running");
});

app.use("/api", userRoute);

export default app;
