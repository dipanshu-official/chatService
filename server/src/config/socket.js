import { Server } from "socket.io";

let io; // Declare io at the module level

// Function to initialize Socket.IO with the HTTP server
const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*', // Replace with specific origin in production
      methods: ['GET', 'POST']
    }
  });

  io.on("connection", (socket) => {
    console.log(`⚡ User connected: ${socket.id}`);

    // Handle events here
    // Example:
    // socket.on("message", (data) => {
    //   console.log(data);
    // });

    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.id}`);
    });
  });
};

// Getter for the initialized io instance
const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};

// Export functions
export { initSocket, getIO };
