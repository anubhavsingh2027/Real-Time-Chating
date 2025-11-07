import jwt from "jsonwebtoken";
import { ENV } from "./env.js";

export const generateAccessToken = (userId) => {
  if (!ENV.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }
  return jwt.sign({ userId }, ENV.JWT_SECRET, {
    expiresIn: "15m", // short lived access token
  });
};

export const generateRefreshToken = (userId) => {
  if (!ENV.JWT_REFRESH_SECRET) {
    throw new Error("JWT_REFRESH_SECRET is not configured");
  }
  return jwt.sign({ userId }, ENV.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

export const setRefreshTokenCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const clearRefreshTokenCookie = (res) => {
  res.cookie("refreshToken", "", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
    maxAge: 0,
  });
};
