/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

 const auth = (requiredRole?: string | undefined) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      //  token check from cookie
      const token = req.cookies?.accessToken;

      if (!token) {
        return res.status(401).json({ message: "Unauthorized: You don't have token!" });
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as any;

      // attach user
      req.user = decoded;

      // role check
      if (requiredRole && decoded.role !== requiredRole) {
        return res.status(403).json({ message: "Forbidden: You don't have permission to access!" });
      }


      next();
    } catch (error) {
      console.log("JWT ERROR:", error);
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};

export default auth;