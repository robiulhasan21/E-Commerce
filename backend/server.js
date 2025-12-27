import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'

import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import orderRouter from './routes/orderRoute.js'
import heroImagesRouter from './routes/heroImagesRoute.js'
import chatRouter from './routes/chatRoute.js'
import contactRouter from './routes/contactRoute.js'
import paymentRoute from "./routes/paymentRoute.js"
import adminOrderRoutes from "./routes/adminOrderRoutes.js"

// App Config
const app = express()
const PORT = process.env.PORT || 4000

// DB & Cloudinary
connectDB()
connectCloudinary()

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ✅ CORS fix (Netlify + Render)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}))

// API Routes
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/order', orderRouter)
app.use('/api/hero-images', heroImagesRouter)
app.use('/api/chat', chatRouter)
app.use('/api/contact', contactRouter)
app.use('/api/payment', paymentRoute)
app.use('/api/admin', adminOrderRoutes)

// Test Route
app.get('/', (req, res) => {
  res.send("API Working 🚀")
})

// Server Listen (Render compatible)
app.listen(PORT, () => {
  console.log(`Server running on PORT : ${PORT}`)
})
