const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Login = require('../models/login.model');
const User = require('../models/user.model');
const sendMail = require('../utils/mailer.util');

exports.createUser = async (req, res) => {
  try {
    const { name, email, phone, password, userType = 'customer' } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const login = new Login({ email, password: hashedPassword, userType });
    const savedLogin = await login.save();

    const user = new User({
      name,
      email,
      phone,
      loginRef: savedLogin._id,  
    });
    const savedUser = await user.save();

   savedLogin.userRef = savedUser._id;
    await savedLogin.save();
    await sendMail(
      email,
      '🎉 Welcome to Our App!',
      `Hi ${name}, welcome aboard!`,
      `
        <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; border: 1px solid #eee; padding: 30px; border-radius: 8px; background-color: #f9f9f9;">
          <h2 style="color: #4CAF50; text-align: center;">Welcome to Our App, ${name}!</h2>
          <p style="font-size: 16px; color: #333;">
            We're thrilled to have you on board. Your account has been created successfully. 
          </p>
          <p style="font-size: 16px; color: #333;">
            You can now log in and explore all the features available to you.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://your-app-url.com/login" style="display: inline-block; background-color: #4CAF50; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Go to Dashboard
            </a>
          </div>
          <p style="font-size: 14px; color: #999; text-align: center;">
            If you have any questions, feel free to reply to this email. We're here to help!
          </p>
          <hr style="margin: 30px 0;">
          <p style="font-size: 12px; color: #aaa; text-align: center;">
            &copy; ${new Date().getFullYear()} Your App Name. All rights reserved.
          </p>
        </div>
      `
    );

    res.status(201).json({
      id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      phone: savedUser.phone,
      userType: savedLogin.userType,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
  

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const login = await Login.findOne({ email });
    if (!login) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, login.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { loginId: login._id, userType: login.userType },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    res.json({
      message: 'Login successful',
      token,
      userType: login.userType
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.viewUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('loginRef', 'userType');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.viewUsers = async (req, res) => {
  try {
    const users = await User.find().populate('loginRef', 'userType');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.viewCustomers = async (req, res) => {
    try {
      const users = await User.find().populate('loginRef', 'userType');
      
      const customers = users
        .filter(user => user.loginRef?.userType === 'customer')
        .map(user => ({
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          userType: user.loginRef.userType
        }));
  
      res.json(customers);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await Login.findByIdAndDelete(user.loginRef);
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
