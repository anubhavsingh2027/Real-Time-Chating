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

export const setRefreshTokenCookie = (res, token) => {
  // Set cookie with strict security settings but no domain
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// For backward compatibility - will be used by existing code
export const generateToken = (userId, res) => {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);
  setRefreshTokenCookie(res, refreshToken);
  return accessToken;
};

// http://localhost
// https://dsmakmk.com
