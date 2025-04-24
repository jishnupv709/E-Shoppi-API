const mongoose = require('mongoose');

const submenuSchema = new mongoose.Schema({
  title: { type: String, required: true },
  icon: { type: String, required: true },
  tooltip: { type: String },
  route: { type: String, required: true },
  roles: { type: [String], default: [] }, // which roles can see this submenu
});

const sidebarMenuSchema = new mongoose.Schema({
  title: { type: String, required: true },
  icon: { type: String, required: true },
  tooltip: { type: String },
  route: { type: String, required: true },
  roles: { type: [String], default: [] }, // which roles can see this menu item
  badge: {
    show: { type: Boolean, default: false },
    type: { type: String, enum: ['notification', 'count', 'info'], default: 'notification' },
    valueSource: { type: String }, // e.g., "unreadNotifications", "pendingOrders"
  },
  submenu: [submenuSchema], // array of submenus
}, { timestamps: true });

module.exports = mongoose.model('SidebarMenu', sidebarMenuSchema);
