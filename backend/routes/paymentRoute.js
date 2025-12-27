import express from "express";
import SSLCommerzPayment from "sslcommerz-lts";
import Order from "../models/orderModel.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();

const store_id = process.env.SSLCOMMERZ_STORE_ID;
const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
const is_live = process.env.SSLCOMMERZ_IS_LIVE === "true";

// 1️⃣ INITIATE PAYMENT
router.post("/sslcommerz/initiate", userAuth, async (req, res) => {
  try {
    const { items = [], address, cus_name, cus_email, cus_phone, amount: reqAmount, paymentMethod } = req.body;

    const userId = req.userId;

    // Prefer the amount sent by frontend; fallback to computed amount
    const amount = Number(reqAmount) || items.reduce((sum, item) => {
      const qty = item.quantity ?? item.qty ?? item.q ?? 0;
      return sum + (Number(item.price) || 0) * Number(qty);
    }, 0);

    const tran_id = "TXN_" + Date.now();

    await Order.create({
      userId,
      items,
      amount,
      address,
      paymentMethod: paymentMethod || 'SSLCOMMERZ',
      payment: true,
      customer: { name: cus_name, email: cus_email, phone: cus_phone },
      transactionId: tran_id,
    });

    const data = {
      total_amount: amount,
      currency: "BDT",
      tran_id,
      success_url: `${process.env.BACKEND_URL}/api/payment/sslcommerz/success`,
      fail_url: `${process.env.BACKEND_URL}/api/payment/sslcommerz/fail`,
      cancel_url: `${process.env.BACKEND_URL}/api/payment/sslcommerz/cancel`,
      ipn_url: `${process.env.BACKEND_URL}/api/payment/sslcommerz/ipn`,

      product_name: "Ecommerce Order",
      product_category: "General",
      product_profile: "general",

      cus_name,
      cus_email,
      cus_phone,
      cus_add1: address.street,
      cus_city: address.city,
      cus_country: address.country,

      value_a: tran_id,
    };

    if (!store_id || !store_passwd) {
      return res.status(500).json({ success: false, message: "Payment gateway not configured" });
    }

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const apiResponse = await sslcz.init(data);

    console.log("[payment/initiate] request data:", { data, userId: req.userId });
    console.log("[payment/initiate] sslcz.init response:", apiResponse);

    // Try multiple possible URL fields returned by provider
    const url = apiResponse?.GatewayPageURL || apiResponse?.GatewayPageUrl || apiResponse?.redirect_url || apiResponse?.redirectUrl || apiResponse?.url;

    if (!url) {
      return res.status(500).json({ success: false, message: "Payment gateway did not return redirect URL", raw: apiResponse });
    }

    res.json({ success: true, url, raw: apiResponse });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});

// 2️⃣ SUCCESS
router.post("/sslcommerz/success", async (req, res) => {
  const { val_id, tran_id } = req.body;

  if (!store_id || !store_passwd) return res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  const validation = await sslcz.validate({ val_id });

  if (validation.status === "VALID") {
    await Order.findOneAndUpdate(
      { transactionId: tran_id },
      { paymentStatus: "paid" }
    );
    return res.redirect(`${process.env.FRONTEND_URL}/payment-success`);
  }

  res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
});

// 3️⃣ FAIL
router.post("/sslcommerz/fail", async (req, res) => {
  const { tran_id } = req.body;
  await Order.findOneAndUpdate(
    { transactionId: tran_id },
    { paymentStatus: "failed" }
  );
  res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
});

// 4️⃣ CANCEL
router.post("/sslcommerz/cancel", async (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}/payment-cancel`);
});

// 5️⃣ IPN
router.post("/sslcommerz/ipn", async (req, res) => {
  const { val_id, tran_id } = req.body;

  if (!store_id || !store_passwd) return res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  const validation = await sslcz.validate({ val_id });

  if (validation.status === "VALID") {
    await Order.findOneAndUpdate(
      { transactionId: tran_id },
      { paymentStatus: "paid" }
    );
  }

  res.send("IPN OK");
});

export default router;

