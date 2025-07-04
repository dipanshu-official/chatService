import express from 'express';
import { getAllUsers, createUser, getUserById, updateUser, deleteUser, loginUser } from '../controllers/user.controller.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/users/create', createUser);
router.post('/users/login', loginUser);
router.get('/allusers', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;