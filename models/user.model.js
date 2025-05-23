const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  loginRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Login',
    required: true
  }
});

module.exports = mongoose.model('User', userSchema);
