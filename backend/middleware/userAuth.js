import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js'

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.headers
        if (!token) {
            return res.json({ success: false, message: "Not Authorized. Please login again" })
        }
        
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(token_decode.id);
        
        if (!user) {
            return res.json({ success: false, message: "User not found. Please login again" })
        }
        
        req.userId = token_decode.id;
        next()
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Invalid token. Please login again" })
    }
}

export default userAuth
