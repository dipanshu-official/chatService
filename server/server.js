import { createServer } from "http";
import app from "./src/app.js";
import { initSocket } from "./src/config/socket.js";
import connectDB from "./src/config/db.js";

const PORT = process.env.PORT || 5000;

const server = createServer(app);

// Initialize socket.io
initSocket(server);

//databse connected
connectDB()

server.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
