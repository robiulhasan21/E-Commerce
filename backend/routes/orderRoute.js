import express from 'express';
import { createOrder, listOrders, getUserOrders, updateOrderStatus } from '../controllers/orderController.js';
import userAuth from '../middleware/userAuth.js';
import adminAuth from '../middleware/adminAuth.js';

const orderRouter = express.Router();

// User routes (require user authentication)
orderRouter.post('/create', userAuth, createOrder);
orderRouter.get('/user', userAuth, getUserOrders);

// Admin routes (require admin authentication)
orderRouter.get('/list', adminAuth, listOrders);
orderRouter.post('/status', adminAuth, updateOrderStatus);

export default orderRouter;
