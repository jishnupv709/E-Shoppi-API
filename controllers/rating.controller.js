const Rating = require('../models/rating.model');
const Product = require('../models/product.model');


// Add a rating with purchase validation
exports.addRating = async (req, res) => {
    try {
      const { rating, message, user, product } = req.body;
  
      // Check if the user has purchased the product
      const order = await Order.findOne({ user, 'products.product': product, status: 'completed' });
  
      if (!order) {
        return res.status(403).json({ message: 'You must purchase this product before rating' });
      }
  
      const newRating = new Rating({ rating, message, user, product });
      const savedRating = await newRating.save();
  
      // Push to product
      await Product.findByIdAndUpdate(product, {
        $push: { ratings: savedRating._id }
      });
  
      // Calculate the new average rating for the product
      const productWithRatings = await Product.findById(product).populate('ratings');
      const totalRatings = productWithRatings.ratings.length;
      const averageRating = productWithRatings.ratings.reduce((sum, rating) => sum + rating.rating, 0) / totalRatings;
  
      // Update the product's average rating
      await Product.findByIdAndUpdate(product, { averageRating });
  
      res.status(201).json(savedRating);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

// Get all ratings for a product
exports.getRatingsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const ratings = await Rating.find({ product: productId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(ratings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
