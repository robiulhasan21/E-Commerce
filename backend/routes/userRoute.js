import express from 'express';
import {adminLogin, loginUser, registerUser, getUserProfile, updateUserProfile, updateUserPassword} from '../controllers/userController.js';
import userAuth from '../middleware/userAuth.js';

const userRouter = express.Router();

// Public routes
userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/admin', adminLogin)

// Protected routes (require authentication)
userRouter.get('/profile', userAuth, getUserProfile)
userRouter.put('/profile', userAuth, updateUserProfile)
userRouter.put('/password', userAuth, updateUserPassword)

export default userRouter;