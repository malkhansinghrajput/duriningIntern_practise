import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ msg: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = decoded;

    next();

  } catch (error) {
    return res.status(403).json({ msg: "Invalid or expired token" });
  }
};