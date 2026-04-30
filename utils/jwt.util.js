import jwt from "jsonwebtoken";

export const createAccessToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY
  });
};

export const createRefreshToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY
  });
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
};