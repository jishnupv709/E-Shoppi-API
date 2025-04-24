const SidebarMenu = require('../models/sidebarMenu.model');

exports.createSidebarMenu = async (req, res) => {
  try {
    const { title, icon, tooltip, route, roles, badge, submenu } = req.body;

    const newSidebarMenu = new SidebarMenu({
      title,
      icon,
      tooltip,
      route,
      roles,
      badge,
      submenu,
    });

    const savedMenu = await newSidebarMenu.save();
    res.status(201).json(savedMenu);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSidebarMenus = async (req, res) => {
  try {
    const userRoles = req.user.userType ? [req.user.userType] : []; // assuming `userType` is set in JWT payload

    // Find menus where the user's role matches
    const menus = await SidebarMenu.find({
      roles: { $in: userRoles }
    }).populate('submenu');

    // Filter submenus based on user roles
    menus.forEach(menu => {
      menu.submenu = menu.submenu.filter(sub => sub.roles.includes(req.user.userType));
    });

    res.json(menus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateSidebarMenu = async (req, res) => {
  try {
    const updatedMenu = await SidebarMenu.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );

    if (!updatedMenu) return res.status(404).json({ message: 'Menu not found' });

    res.json(updatedMenu);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteSidebarMenu = async (req, res) => {
  try {
    const deletedMenu = await SidebarMenu.findByIdAndDelete(req.params.id);
    
    if (!deletedMenu) return res.status(404).json({ message: 'Menu not found' });
    
    res.json({ message: 'Menu deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

