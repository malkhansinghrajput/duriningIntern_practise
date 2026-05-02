import jwt from "jsonwebtoken";

export const createAccessToken = (userId, role) => {
  return jwt.sign(
    { userId, role }, 
    process.env.ACCESS_TOKEN_SECRET || "access-secret", 
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m" }
  );
};

export const createRefreshToken = (userId, role) => {
  return jwt.sign(
    { userId, role }, 
    process.env.REFRESH_TOKEN_SECRET || "refresh-secret", 
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d" }
  );
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "access-secret");
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET || "refresh-secret");
};
