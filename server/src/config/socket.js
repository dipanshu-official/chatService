// src/config/socket.js
import { Server } from "socket.io";
import Message from "../models/message.model.js";

export const initSocket = (server) => {
  const io = new Server(server , {
    cors: {
      origin: "http://localhost:5173", 
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`🟢 Socket connected: ${socket.id}`);

    // Handle incoming message
    socket.on("sendMessage", async (data) => {
      const { text, sender, time, avatar } = data;
      try {
        const newMessage = new Message({ text, sender, time, avatar });
        await newMessage.save();

        // Broadcast to all connected clients
        io.emit("receiveMessage", newMessage);
        console.log(newMessage)
      } catch (error) {
        console.error("❌ Failed to save message:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log(`🔴 Socket disconnected: ${socket.id}`);
    });
  });
};
