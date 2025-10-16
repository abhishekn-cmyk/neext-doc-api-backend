import { NextFunction } from "express";

type UserRole = "SuperAdmin" | "User";

interface User {
  role: UserRole;
}

export const authorize = (roles: UserRole[]) => {
  return (req: any, res: any, next: NextFunction): void => {
    if (req.user.role === "SuperAdmin") {
      return next();
    }

    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied: You do not have the required role.",
      });
    }

    next();
  };
};
