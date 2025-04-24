const mongoose = require('mongoose');

// 🔹 Embedded Subcategory Schema
const subcategorySchema = new mongoose.Schema({
  subCategoryName: { type: String, required: true },
  description: { type: String }
});

// 🔹 Main Category Schema
const categorySchema = new mongoose.Schema({
  categoryName: { type: String, required: true },
  description: { type: String },
  subcategories: [subcategorySchema]
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
