import jwt from "jsonwebtoken";
import User from "../models/User.js";

const getJwtSecret = () =>
  process.env.JWT_SECRET || "cartly_internship_jwt_secret_key_2026";

export const generateToken = (id, role) => {
  return jwt.sign({ id, role }, getJwtSecret(), {
    expiresIn: "7d",
  });
};

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, getJwtSecret());

      const user = await User.findById(decoded.id);
      if (!user) {
        return res
          .status(401)
          .json({ message: "Not authorized, user account no longer exists" });
      }

      req.user = {
        _id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      };
      return next();
    } catch (error) {
      return res
        .status(401)
        .json({ message: "Not authorized, invalid or expired token" });
    }
  }

  return res
    .status(401)
    .json({ message: "Not authorized, authentication token required" });
};

export default protect;
