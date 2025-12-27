import express from 'express';
import {adminLogin, loginUser, registerUser, getUserProfile, updateUserProfile, updateUserPassword, uploadUserAvatar, forgotPassword, resetPassword} from '../controllers/userController.js';
import userAuth from '../middleware/userAuth.js';
import upload from '../middleware/multer.js';

const userRouter = express.Router();

// Public routes
userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/admin', adminLogin)

// Protected routes (require authentication)
userRouter.get('/profile', userAuth, getUserProfile)
userRouter.put('/profile', userAuth, updateUserProfile)
userRouter.put('/password', userAuth, updateUserPassword)
userRouter.put('/profile/avatar', userAuth, upload.single('avatar'), uploadUserAvatar)

// Password reset routes
userRouter.post('/forgot-password', forgotPassword)
userRouter.post('/reset-password', resetPassword)

export default userRouter;