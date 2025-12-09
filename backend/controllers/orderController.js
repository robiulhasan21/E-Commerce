import orderModel from "../models/orderModel.js";

// Create order
const createOrder = async (req, res) => {
    try {
        const userId = req.userId; // Get from authenticated user
        const { items, amount, address, paymentMethod } = req.body;

        // Validate input
        if (!items || !amount || !address) {
            return res.json({ success: false, message: "Please provide all required fields" });
        }

        if (!Array.isArray(items) || items.length === 0) {
            return res.json({ success: false, message: "Order must contain at least one item" });
        }

        const orderData = {
            userId,
            items,
            amount: Number(amount),
            address,
            paymentMethod: paymentMethod || "COD",
            payment: paymentMethod !== "COD"
        };

        const order = new orderModel(orderData);
        await order.save();

        res.json({ success: true, message: "Order placed successfully", order });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// List all orders (for admin)
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({}).sort({ date: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get user orders
const getUserOrders = async (req, res) => {
    try {
        const userId = req.userId;
        const orders = await orderModel.find({ userId }).sort({ date: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Update order status (for admin)
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        if (!orderId || !status) {
            return res.json({ success: false, message: "Please provide orderId and status" });
        }

        const order = await orderModel.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );

        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }

        res.json({ success: true, message: "Order status updated", order });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { createOrder, listOrders, getUserOrders, updateOrderStatus };
