import jwt from "jsonwebtoken";
import { ENV } from "./env.js";

export const generateAccessToken = (userId) => {
  const { JWT_SECRET } = ENV;
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "15m", // Short-lived access token
  });
};

export const generateRefreshToken = (userId) => {
  const { JWT_SECRET } = ENV;
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "7d", // Long-lived refresh token
  });
};

// Generate both tokens without setting cookies
export const generateTokens = (userId) => {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);
  return { accessToken, refreshToken };
};

// http://localhost
// https://dsmakmk.com
