import { Server } from "socket.io";

let io; // Global Socket.IO instance

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });
  io.on("connection", (socket) => {
    console.log(`[${new Date().toISOString()}] ⚡ Connected: ${socket.id}`);

    // Event: disconnect
    socket.on("disconnect", (reason) => {
      console.log(
        `[${new Date().toISOString()}] ❌ Disconnected: ${
          socket.id
        } | Reason: ${reason}`
      );
    });

    // Optional: log when reconnecting
    socket.on("reconnect", (attemptNumber) => {
      console.log(
        `[${new Date().toISOString()}] 🔄 Reconnected: ${
          socket.id
        } | Attempt: ${attemptNumber}`
      );
    });

    // Optional: log disconnecting manually
    socket.on("manual-disconnect", () => {
      socket.disconnect();
      console.log(`👋 ${socket.id} manually disconnected`);
    });
  });
};

const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};

export { initSocket, getIO };
