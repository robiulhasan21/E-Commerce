import validator from "validator";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import crypto from 'crypto'
import userModel from "../models/userModel.js";

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

// Route for user login
const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.json({ success: false, message: "Please provide email and password" })
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User doesn't exist" })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = createToken(user._id)
            res.json({ success: true, token })
        }
        else {
            res.json({ success: false, message: 'Invalid credentials' })
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}

// Route for user register
const registerUser = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        // Validate input fields
        if (!name || !email || !password) {
            return res.json({ success: false, message: "Please fill in all fields" })
        }

        // Checking user already exists or not
        const exists = await userModel.findOne({ email })
        if (exists) {
            return res.json({ success: false, message: "User already exists" })
        }

        // Validating email format & strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password (minimum 8 characters)" })
        }

        // Hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        })

        const user = await newUser.save()
        const token = createToken(user._id)

        res.json({ success: true, token })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })

    }
}

// Route for admin login
const adminLogin = async (req, res) => {
    try {

        const {email,password} = req.body

        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            const token = jwt.sign(email+password,process.env.JWT_SECRET);
            res.json({success:true,token})
        } else {
            res.json({success:false,message:"Invalid credentials"})
        }
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}

// Route to get user profile
const getUserProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId).select('-password');
        
        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }

        res.json({ success: true, user })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Route to update user profile
const updateUserProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        const userId = req.userId;

        // Validate input
        if (!name || !email) {
            return res.json({ success: false, message: "Please provide name and email" })
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        // Check if email is already taken by another user
        const existingUser = await userModel.findOne({ email, _id: { $ne: userId } });
        if (existingUser) {
            return res.json({ success: false, message: "Email already in use" })
        }

        // Update user
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { name, email },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.json({ success: false, message: "User not found" })
        }

        res.json({ success: true, user: updatedUser, message: "Profile updated successfully" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Route to update user password
const updateUserPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.userId;

        // Validate input
        if (!currentPassword || !newPassword) {
            return res.json({ success: false, message: "Please provide current and new password" })
        }

        // Validate new password strength
        if (newPassword.length < 8) {
            return res.json({ success: false, message: "New password must be at least 8 characters long" })
        }

        // Get user
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Current password is incorrect" })
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        await userModel.findByIdAndUpdate(userId, { password: hashedPassword });

        res.json({ success: true, message: "Password updated successfully" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

export { loginUser, registerUser, adminLogin, getUserProfile, updateUserProfile, updateUserPassword }

// Upload user avatar
const uploadUserAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.json({ success: false, message: 'No file uploaded' })
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: 'image',
            folder: 'user-avatars'
        })

        const updatedUser = await userModel.findByIdAndUpdate(
            req.userId,
            { avatar: { url: result.secure_url, public_id: result.public_id } },
            { new: true }
        ).select('-password')

        if (!updatedUser) {
            return res.json({ success: false, message: 'User not found' })
        }

        res.json({ success: true, user: updatedUser, message: 'Avatar uploaded successfully' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { uploadUserAvatar }

// Forgot password - generate token and (optionally) send email
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) return res.json({ success: false, message: 'Email is required' })

        const user = await userModel.findOne({ email })
        if (!user) return res.json({ success: false, message: 'User not found' })

        // generate token
        const token = crypto.randomBytes(20).toString('hex')
        const expiry = Date.now() + 3600000 // 1 hour

        user.resetToken = token
        user.resetTokenExpiry = expiry
        await user.save()

        // NOTE: Email sending is not configured. Returning token in response for development/testing.
        res.json({ success: true, message: 'Reset token generated. Use this token to reset password.', token })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Reset password using token
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body
        if (!token || !newPassword) return res.json({ success: false, message: 'Token and new password are required' })

        if (newPassword.length < 8) return res.json({ success: false, message: 'Password must be at least 8 characters' })

        const user = await userModel.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } })
        if (!user) return res.json({ success: false, message: 'Invalid or expired token' })

        const salt = await bcrypt.genSalt(10)
        const hashed = await bcrypt.hash(newPassword, salt)

        user.password = hashed
        user.resetToken = null
        user.resetTokenExpiry = null
        await user.save()

        res.json({ success: true, message: 'Password has been reset successfully' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { forgotPassword, resetPassword }