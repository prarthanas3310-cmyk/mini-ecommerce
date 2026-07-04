import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress, couponCode, discountAmount } = req.body;
    const order = await Order.create({
      user: req.user._id,
      items,
      totalAmount,
      shippingAddress,
      couponCode,
      discountAmount,
    });
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const isOwner = order.user.toString() === req.user._id.toString();
    if (!isOwner) {
      return res.status(403).json({ message: "Not authorized" });
    }
    if (order.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Only pending orders can be cancelled" });
    }

    order.status = "cancelled";
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
