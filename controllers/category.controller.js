const Category = require('../models/category.model');

// Add a new category
exports.addCategory = async (req, res) => {
  try {
    const { categoryName, description } = req.body;
    const category = new Category({ categoryName, description });
    const saved = await category.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a subcategory to an existing category
exports.addSubcategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { subCategoryName, description } = req.body;

    const category = await Category.findById(categoryId);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    category.subcategories.push({ subCategoryName, description });
    await category.save();

    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all categories with subcategories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update category by ID
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryName, description } = req.body;

    const updated = await Category.findByIdAndUpdate(
      id,
      { categoryName, description },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Category not found' });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete category (also deletes subcategories since they are embedded)
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Category.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ message: 'Category not found' });

    res.json({ message: 'Category and subcategories deleted', category: deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
