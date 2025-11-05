import jwt from "jsonwebtoken";
import { ENV } from "./env.js";

export const generateToken = (userId, res) => {
  const { JWT_SECRET,NODE_ENV } = ENV;
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "7d",
  });

   res.cookie("jwt", token, {
  httpOnly: true,
  secure: true,          // ALWAYS TRUE since koyeb = HTTPS
  sameSite: "None",      // ALWAYS NONE because frontend & backend = different domains
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});
return token;


// http://localhost
// https://dsmakmk.com
