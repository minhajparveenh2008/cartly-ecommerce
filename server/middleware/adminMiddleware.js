export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res
    .status(403)
    .json({ message: "Access denied. Administrator privileges required." });
};

export const userOnly = (req, res, next) => {
  if (req.user && req.user.role === "user") {
    return next();
  }
  return res.status(403).json({
    message:
      "Customer account required for checkout. Administrators cannot place customer orders.",
  });
};

export default adminOnly;
