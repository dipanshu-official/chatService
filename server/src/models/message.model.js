import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    enum: ["me", "them"], // or use user IDs if real users
    required: true,
  },
  time: {
    type: String, // Or use Date if you prefer full timestamps
    required: true,
  },
  avatar: {
    type: String,
    required: false,
  },
}, {
  timestamps: true // adds createdAt and updatedAt fields
});

const Message = mongoose.model("ChatMessage", MessageSchema);
export default ChatMessage;
