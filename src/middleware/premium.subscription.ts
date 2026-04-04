import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";


export const requirePremiumForMedia = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;
  const mediaId = req.params.id;

  const media = await prisma.media.findUnique({
    where: { id: mediaId as string },
  });

  if (!media) {
    return res.status(404).json({ message: "Media not found!!" });
  }

  if (media.priceType === "Free") {
    return next();
  }

  const subscription = await prisma.subscription.findFirst({
    where: {
      userId: userId as string,
      status: "active",
    },
  });

  if (!subscription) {
    return res.status(403).json({
      message: "Premium subscription required!!",
    });
  }

  next();
};