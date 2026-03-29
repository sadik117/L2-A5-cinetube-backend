/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from "../lib/auth";

const auth = (resource: string, action: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // betterAuth will check cookies automatically
      const session = await betterAuth.api.getSession({
        headers: req.headers,
      });

      if (!session) {
        return res.status(401).json({ message: "Unauthorized!" });
      }

      const role = session.user.role as "USER" | "ADMIN";

      const hasPermission = await betterAuth.api.userHasPermission({
        body: {
          userId: session.user.id,
          role,
          permissions: { [resource]: [action] },
        },
      });

      if (!hasPermission) {
        return res.status(403).json({ 
          message: `Forbidden: You do not have permission to ${action} ${resource}!`,
        });
      }

      (req as any).user = session.user;
      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
};

export default auth;