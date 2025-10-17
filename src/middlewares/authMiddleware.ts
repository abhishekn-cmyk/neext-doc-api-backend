import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { SuperAdmin } from "../models/SuperAdmin";
import { User } from "../models/User";

interface AuthRequest extends Request {
  user?: any;
}

export const protect = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      // No token provided
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({
          success: false,
          message: "Not authorized, no token provided",
        });
        throw new Error("No token provided");
      }

      const token = authHeader.split(" ")[1];

      // Verify token
      let decoded: JwtPayload;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      } catch (err: any) {
        res.status(401).json({
          success: false,
          message: "Invalid token",
          error: err.message,
        });
        throw new Error("Invalid token");
      }

      const userId = decoded._id || decoded.id;
      const role = decoded.role;

      // Invalid payload
      if (!userId || !role) {
        res.status(401).json({ success: false, message: "Invalid token payload" });
        throw new Error("Invalid token payload");
      }

      // Fetch user from DB
      let user;
      if (role === "User") {
        user = await User.findById(userId).select("-password");
      } else if (role === "SuperAdmin") {
        user = await SuperAdmin.findById(userId).select("-password");
      }

      if (!user) {
        res.status(401).json({ success: false, message: "User not found" });
        throw new Error("User not found");
      }

      req.user = user;

      console.log("✅ [AUTH] Authenticated user:", { id: user._id, role: user.role });

      next();
    } catch (err: any) {
      console.error("❌ [AUTH] Protect middleware error:", err.message);
      // If response already sent, do nothing
      if (!res.headersSent) {
        res.status(401).json({
          success: false,
          message: "Not authorized, token failed",
          error: err.message,
        });
      }
    }
  }
);
