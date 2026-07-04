import Coupon from "../models/Coupon.js";

export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code: code?.toUpperCase(), active: true });
    if (!coupon) {
      return res.status(404).json({ message: "Invalid or expired coupon code" });
    }
    res.json({ code: coupon.code, discountPercent: coupon.discountPercent });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createCoupon = async (req, res) => {
  try {
    const { code, discountPercent } = req.body;
    const coupon = await Coupon.create({ code, discountPercent });
    res.status(201).json(coupon);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: "Coupon removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
