import { getOrderModel } from '../models/Order.js';

// Fetch all orders (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const Order = await getOrderModel();

    // Fetch all orders, include only necessary fields
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .lean(); // convert to plain JS object

    res.status(200).json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // new status
    const allowedStatuses = ["Pending", "Processing", "Out for Delivery", "Delivered", "Cancelled"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const Order = await getOrderModel();
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { orderStatus: status },
      { new: true }
    );

    if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });

    res.status(200).json(updatedOrder);
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ message: 'Failed to update order', error: err.message });
  }
};

// Cancel order
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const Order = await getOrderModel();

    const cancelledOrder = await Order.findByIdAndUpdate(
      id,
      { orderStatus: 'Cancelled' },
      { new: true }
    );

    if (!cancelledOrder) return res.status(404).json({ message: 'Order not found' });

    res.status(200).json(cancelledOrder);
  } catch (err) {
    console.error('Error cancelling order:', err);
    res.status(500).json({ message: 'Failed to cancel order', error: err.message });
  }
};
//get orderby emails

export const getOrdersByEmail = async (req, res) => {
  try {
    const Order = await getOrderModel();
    const email = req.query.email;

    const orders = await Order.find({'user.email': email });

    if (!orders.length) {
      return res.status(404).json({ message: 'No orders found for this user' });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders by email:", error);
    res.status(500).json({ message: 'Error fetching user orders' });
  }
};


export const getOrders = async (req, res) => {
  try {
    const Order = await getOrderModel();
    const orders = await Order.find({ 'user.email': req.user.email })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(orders);
  } catch (err) {
    console.error('Error fetching user orders:', err);
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
}
};