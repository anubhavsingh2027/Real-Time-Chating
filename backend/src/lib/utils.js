import jwt from "jsonwebtoken";
import { ENV } from "./env.js";

export const generateToken = (userId, res) => {
  const { JWT_SECRET } = ENV;
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "7d",
  });

   res.cookie("jwt", token, {
    httpOnly: true, // secure from JS access
    secure: NODE_ENV === "development" ? false : true, // only send over HTTPS
    sameSite: NODE_ENV === "development" ? "lax" : "none", // ✅ allow cross-domain cookies
    path: "/", // ensures cookie is valid for all routes
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  return token;
};

// http://localhost
// https://dsmakmk.com
