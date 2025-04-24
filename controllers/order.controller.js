const Order = require('../models/order.model');
const Product = require('../models/product.model');
const User = require('../models/user.model');

// Place a new order
exports.placeOrder = async (req, res) => {
  try {
    const { user, products } = req.body;

    // Ensure that the user exists
    const foundUser = await User.findById(user);
    if (!foundUser) return res.status(404).json({ message: 'User not found' });

    // Ensure products are valid and available in stock
    for (const item of products) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ message: `Product ${item.product} not found` });
      if (product.quantity < item.quantity) return res.status(400).json({ message: `Not enough stock for ${product.productName}` });
    }

    // Deduct stock from products
    for (const item of products) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { quantity: -item.quantity }
      });
    }

    // Create new order
    const newOrder = new Order({
      user,
      products,
      status: 'pending', // default status is 'pending'
    });

    await Notification.create({
        user: foundUser._id,
        title: '🛒 Order Confirmed',
        message: `Your order (${savedOrder._id}) has been placed successfully.`,
      });
      
      const admins = await Login.find({ userType: 'admin' }).populate('userRef'); // Assuming `userRef` is backlinked to `User`

    for (const admin of admins) {
      await Notification.create({
        user: admin.userRef._id,
        title: '🧾 New Order Received',
        message: `${foundUser.name} just placed an order (${savedOrder._id}).`,
      });
    }

    const savedOrder = await newOrder.save();
    await sendMail(
        foundUser.email,
        '🛒 Order Confirmation',
        `Hi ${foundUser.name}, your order has been placed successfully.`,
        `
          <div style="padding: 20px; font-family: Arial;">
            <h2 style="color: #4CAF50;">Thank you for your order!</h2>
            <p>We've received your order and it's now being processed.</p>
            <p>Order ID: <strong>${savedOrder._id}</strong></p>
            <p>Status: <strong>${savedOrder.status}</strong></p>
            <p>We'll notify you once the status changes.</p>
          </div>
        `
      );
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// View all orders (admin access)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email') // Populate user info
      .populate('products.product', 'productName price'); // Populate product info for each item
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// View orders for a specific user
exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ user: userId })
      .populate('user', 'name email') // Populate user info
      .populate('products.product', 'productName price'); // Populate product info for each item
    if (!orders.length) return res.status(404).json({ message: 'No orders found for this user' });

    res.json(orders);
    const user = await User.findById(updatedOrder.user);

    await sendMail(
        foundUser.email,
        '🛒 Order Confirmation',
        `Hi ${foundUser.name}, your order has been placed successfully.`,
        `
          <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px; border-radius: 10px; border: 1px solid #ddd;">
            <h2 style="color: #4CAF50; text-align: center;">🛒 Thank You for Your Order!</h2>
            <p>Hi <strong>${foundUser.name}</strong>,</p>
            <p>We’ve received your order and it’s now being processed.</p>
            
            <p><strong>Order ID:</strong> ${savedOrder._id}</p>
            <p><strong>Status:</strong> ${savedOrder.status}</p>
      
            <hr>
            <p>You’ll receive updates as your order moves through the process.</p>
      
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://your-app-url.com/orders/${savedOrder._id}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px;">View Your Order</a>
            </div>
      
            <p style="margin-top: 40px; font-size: 12px; color: #999; text-align: center;">
              Need help? Just reply to this email.<br>
              &copy; ${new Date().getFullYear()} Your App Name
            </p>
          </div>
        `
      );
      
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    };

// Update the status of an order (admin access)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Valid status values
    const validStatuses = ['pending', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });

    // Fetch all users who ordered this product before (basic example)
    const ordersWithProduct = await Order.find({ 'products.product': productId }).distinct('user');
    
    for (const userId of ordersWithProduct) {
      await Notification.create({
        user: userId,
        title: '📦 Product Status Updated',
        message: `A product you ordered (${productName}) is now marked as "${newStatus}".`,
      });
    }

    res.json(updatedOrder);
    await sendMail(
        user.email,
        '📦 Order Status Updated',
        `Hi ${user.name}, your order status has changed to "${status}".`,
        `
          <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; background-color: #ffffff; padding: 30px; border-radius: 10px; border: 1px solid #eee;">
            <h2 style="color: #007BFF; text-align: center;">📦 Order Status Updated</h2>
            <p>Hello <strong>${user.name}</strong>,</p>
            <p>Your order <strong>#${updatedOrder._id}</strong> has been updated to:</p>
            <p style="font-size: 18px;"><strong>${status.toUpperCase()}</strong></p>
      
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://your-app-url.com/orders/${updatedOrder._id}" style="background-color: #007BFF; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px;">Track Your Order</a>
            </div>
      
            <p style="margin-top: 40px; font-size: 12px; color: #777; text-align: center;">
              If you have any questions, feel free to reach out.<br>
              &copy; ${new Date().getFullYear()} Your App Name
            </p>
          </div>
        `
      );
      
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
