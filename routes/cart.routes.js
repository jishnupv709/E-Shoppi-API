const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');


/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Manage user carts
 */
/**
 * @swagger
 * /cart/{userId}:
 *   get:
 *     summary: Get the cart for a specific user
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user whose cart is being fetched
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Internal server error
 */
router.get('/:userId', cartController.getCart);

/**
 * @swagger
 * /cart/{userId}:
 *   post:
 *     summary: Add an item to the user's cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user adding the item to the cart
 *       - in: body
 *         name: item
 *         description: The product to add to the cart
 *         schema:
 *           type: object
 *           properties:
 *             productId:
 *               type: string
 *               description: The ID of the product to be added
 *             quantity:
 *               type: number
 *               description: The quantity of the product
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Item added to cart successfully
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Internal server error
 */
router.post('/:userId', cartController.addToCart);

/**
 * @swagger
 * /cart/{userId}/{productId}:
 *   put:
 *     summary: Update the quantity of an item in the cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user whose cart is being updated
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product whose quantity is being updated
 *       - in: body
 *         name: quantity
 *         description: The new quantity for the item
 *         schema:
 *           type: object
 *           properties:
 *             quantity:
 *               type: number
 *               description: The updated quantity
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Quantity updated successfully
 *       400:
 *         description: Invalid data or product not found
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Internal server error
 */
router.put('/:userId/:productId', cartController.updateQuantity);

/**
 * @swagger
 * /cart/{userId}/{productId}:
 *   delete:
 *     summary: Remove an item from the user's cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user whose cart is being updated
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to remove from the cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Item removed from cart successfully
 *       400:
 *         description: Invalid data or product not found
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Internal server error
 */
router.delete('/:userId/:productId', cartController.removeItem);

/**
 * @swagger
 * /cart/{userId}:
 *   delete:
 *     summary: Clear all items from the user's cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user whose cart will be cleared
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Internal server error
 */
router.delete('/:userId', cartController.clearCart);

module.exports = router;
