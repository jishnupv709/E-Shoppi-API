const authorize = (roles = []) => {
    return (req, res, next) => {
      if (!Array.isArray(roles)) roles = [roles];
  
      if (!req.user || !roles.includes(req.user.userType)) {
        return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
      }
  
      next();
    };
  };
  
  module.exports = authorize;
  