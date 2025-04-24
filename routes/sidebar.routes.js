const express = require('express');
const router = express.Router();
const { createSidebarMenu, getSidebarMenus, updateSidebarMenu, deleteSidebarMenu } = require('../controllers/sidebarMenu.controller');
const authorize = require('../middleware/authorize'); 
const authMiddleware = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Sidebar Menu
 *   description: Sidebar menu management for Diffrent user roles
 */
/**
 * @swagger
 * /sidebar:
 *   post:
 *     summary: Create a new sidebar menu (admin only)
 *     tags: [Sidebar Menu]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               icon:
 *                 type: string
 *               title:
 *                 type: string
 *               tooltip:
 *                 type: string
 *               submenu:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     icon:
 *                       type: string
 *                     title:
 *                       type: string
 *                     tooltip:
 *                       type: string
 *     responses:
 *       201:
 *         description: Sidebar menu created successfully
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal Server Error
 */
router.post('/sidebar', authMiddleware, authorize('admin'), createSidebarMenu);

/**
 * @swagger
 * /sidebar:
 *   get:
 *     summary: Get sidebar menus for a specific role (customer only)
 *     tags: [Sidebar Menu]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of sidebar menus for the customer
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal Server Error
 */
router.get('/sidebar', authMiddleware, authorize('customer'), getSidebarMenus);

/**
 * @swagger
 * /sidebar/{id}:
 *   patch:
 *     summary: Update a sidebar menu (admin only)
 *     tags: [Sidebar Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The sidebar menu ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               icon:
 *                 type: string
 *               title:
 *                 type: string
 *               tooltip:
 *                 type: string
 *               submenu:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     icon:
 *                       type: string
 *                     title:
 *                       type: string
 *                     tooltip:
 *                       type: string
 *     responses:
 *       200:
 *         description: Sidebar menu updated successfully
 *       400:
 *         description: Invalid data
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Sidebar menu not found
 *       500:
 *         description: Internal Server Error
 */
router.patch('/sidebar/:id', authMiddleware, authorize('admin'), updateSidebarMenu);

/**
 * @swagger
 * /sidebar/{id}:
 *   delete:
 *     summary: Delete a sidebar menu (admin only)
 *     tags: [Sidebar Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The sidebar menu ID to delete
 *     responses:
 *       200:
 *         description: Sidebar menu deleted successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Sidebar menu not found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/sidebar/:id', authMiddleware, authorize('admin'), deleteSidebarMenu);

module.exports = router;
