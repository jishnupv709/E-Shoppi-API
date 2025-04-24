const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const authMiddleware = require('../middleware/auth.middleware');
const authorize = require('../middleware/authorize'); 

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Manage products
 */
/**
 * @swagger
 * /products/create-product:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the product
 *               description:
 *                 type: string
 *                 description: A detailed description of the product
 *               price:
 *                 type: number
 *                 format: float
 *                 description: The price of the product
 *               quantity:
 *                 type: number
 *                 description: Available stock for the product
 *               category:
 *                 type: string
 *                 description: Category ID to which the product belongs
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Invalid product data
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Internal server error
 */
router.post('/create-product', authMiddleware, authorize('admin'), productController.addProduct);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get a list of all products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of products
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Internal server error
 */
router.get('/', authMiddleware, productController.getProducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by its ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The product details
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Internal server error
 */
router.get('/:id', authMiddleware, productController.getProductById);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update product details (admin and customer)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the product
 *               description:
 *                 type: string
 *                 description: A detailed description of the product
 *               price:
 *                 type: number
 *                 format: float
 *                 description: The price of the product
 *               quantity:
 *                 type: number
 *                 description: Available stock for the product
 *               category:
 *                 type: string
 *                 description: Category ID to which the product belongs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Invalid product data
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Internal server error
 */
router.put('/:id', authMiddleware, authorize(['customer', 'admin']), productController.updateProduct);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product by its ID (admin only)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to delete
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authMiddleware, authorize('admin'), productController.deleteProduct);

module.exports = router;
