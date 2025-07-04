import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  avatar: {
    type: String, // URL to avatar image
    default: ''
  },
  lastMessage: {
    type: String,
    default: "",
  },
    online: {
    type: Boolean,
    default: false,
  },
},{timestamps:true});

const User = mongoose.model('User', userSchema);
export default User;
