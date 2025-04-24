const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/rating.controller');
const authMiddleware = require('../middleware/auth.middleware');


/**
 * @swagger
 * tags:
 *   name: Ratings
 *   description: Manage product ratings
 */
/**
 * @swagger
 * /ratings:
 *   post:
 *     summary: Add a rating for a product
 *     tags: [Ratings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: The ID of the product being rated
 *               rating:
 *                 type: number
 *                 format: float
 *                 description: The rating for the product (1-5)
 *               comment:
 *                 type: string
 *                 description: A comment for the rating
 *     responses:
 *       201:
 *         description: Rating added successfully
 *       400:
 *         description: Invalid data provided
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Internal server error
 */
router.post('/', ratingController.addRating);

/**
 * @swagger
 * /ratings/product/{productId}:
 *   get:
 *     summary: Get all ratings for a product
 *     tags: [Ratings]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to fetch ratings for
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of ratings for the product
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.get('/product/:productId', authMiddleware, ratingController.getRatingsByProduct);

module.exports = router;

