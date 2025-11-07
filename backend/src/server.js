import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { app, server } from "./lib/socket.js";

const __dirname = path.resolve();

const PORT = ENV.PORT || 3000;

app.use(express.json({ limit: "50mb" })); // req.body
app.use(cookieParser());

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests from our frontend origins and no origin (like mobile apps)
    const allowedOrigins = [ENV.CLIENT_URL];
    if (ENV.NODE_ENV === 'development') {
      allowedOrigins.push('http://localhost:5173', 'http://localhost:3000');
    }
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Set-Cookie'],
};

app.use(cors(corsOptions));

// Additional security headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  // Only set Access-Control-Allow-Origin if origin is allowed
  const origin = req.headers.origin;
  if (origin && corsOptions.origin(origin, (err, allowed) => allowed)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  next();
});

//==Server Starting

app.get('/',(req,res,next)=>{
  res.send("Server Running");
})

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);



server.listen(PORT, () => {
  console.log("Server running on port: " + PORT);
  connectDB();
});
