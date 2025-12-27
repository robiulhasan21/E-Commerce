import express from "express";
import Order from "../models/orderModel.js";

const router = express.Router();

router.get("/orders", async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

router.get("/orders/status/:status", async (req, res) => {
  const orders = await Order.find({
    paymentStatus: req.params.status,
  });
  res.json(orders);
});

export default router;
