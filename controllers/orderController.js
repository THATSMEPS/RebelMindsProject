const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const mongoose = require('mongoose');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { restaurant_id, customer_name, order_type, items } = req.body;

    if (!restaurant_id || !customer_name || !order_type || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    // Validate menu_item_ids and check is_available
    const menuItemIds = items.map(item => item.menu_item_id);
    if (!menuItemIds.every(id => mongoose.Types.ObjectId.isValid(id))) {
      return res.status(400).json({ message: 'Invalid menu_item_id in items' });
    }

    const menuItems = await MenuItem.find({
      _id: { $in: menuItemIds },
      restaurant_id: restaurant_id,
      is_available: true,
    });

    if (menuItems.length !== items.length) {
      return res.status(400).json({ message: 'One or more menu items are not available or do not belong to the restaurant' });
    }

    // Calculate total price and prepare order items
    let totalPrice = 0;
    const orderItems = items.map(item => {
      const menuItem = menuItems.find(mi => mi._id.toString() === item.menu_item_id);
      const itemTotal = menuItem.price * item.quantity;
      totalPrice += itemTotal;
      return {
        menu_item_id: menuItem._id,
        name: menuItem.name,
        quantity: item.quantity,
        price: menuItem.price,
        total: itemTotal,
      };
    });

    // Save order
    const order = new Order({
      restaurant_id,
      customer_name,
      order_type,
      items: orderItems,
      total_price: totalPrice,
    });

    const savedOrder = await order.save();

    // Return order response
    res.status(201).json({
      _id: savedOrder._id,
      customer_name: savedOrder.customer_name,
      order_type: savedOrder.order_type,
      created_at: savedOrder.created_at,
      items: savedOrder.items.map(i => ({
        name: i.name,
        quantity: i.quantity,
        total: i.total,
      })),
      total_price: savedOrder.total_price,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get order details by ID
exports.getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      customer_name: order.customer_name,
      order_type: order.order_type,
      created_at: order.created_at,
      items: order.items.map(i => ({
        name: i.name,
        quantity: i.quantity,
        total: i.total,
      })),
      total_price: order.total_price,
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
