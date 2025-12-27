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
import paymentRoute from "./routes/paymentRoute.js";
import adminOrderRoutes from "./routes/adminOrderRoutes.js";


// App Config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// Middleweres

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

// Api endpoints
app.use('/api/user',userRouter)
app.use('/api/product',productRouter)
app.use('/api/order',orderRouter)
app.use('/api/hero-images',heroImagesRouter)
app.use('/api/chat', chatRouter)
app.use('/api/contact', contactRouter)
app.use("/api/payment", paymentRoute);
app.use("/api/admin", adminOrderRoutes);



app.get('/',(req,res)=>{
    res.send("API Working")
})

app.listen(port,()=> console.log('Server started on PORT : '+ port))
