const Product = require('../models/product.model');

// Add a product
exports.addProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all products
// Get all products
exports.getProducts = async (req, res) => {
    try {
      const products = await Product.find()
        .populate('category', 'categoryName') // Populate category
        .populate({
          path: 'ratings', // Populate ratings
          populate: { path: 'user', select: 'name email' } // Populate user data for each rating
        });
      res.json(products);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  // Get single product by ID
  exports.getProductById = async (req, res) => {
    try {
      const product = await Product.findById(req.params.id)
        .populate('category', 'categoryName') // Populate category
        .populate({
          path: 'ratings', // Populate ratings
          populate: { path: 'user', select: 'name email' } // Populate user data for each rating
        });
      
      if (!product) return res.status(404).json({ message: 'Product not found' });
      res.json(product);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted', product: deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
