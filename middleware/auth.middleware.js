import jwt from "jsonwebtoken";
import { verifyAccessToken } from "../utils/jwt.util.js";

export const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check header exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ 
        success: false,
        message: "No token provided" 
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = verifyAccessToken(token);

    // Attach user
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();

  } catch (err) {
    // Handle specific errors
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ 
        success: false,
        message: "Token expired" 
      });
    }

    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ 
        success: false,
        message: "Invalid token" 
      });
    }

    return res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
};