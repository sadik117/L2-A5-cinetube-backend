import { prisma } from "../../lib/prisma";

export const toggleLike = async (userId: string, reviewId: string) => {

  // check if already liked
  const existing = await prisma.like.findUnique({
    where: {
      userId_reviewId: {
        userId,
        reviewId,
      },
    },
  });

  if (existing) {
    // unlike
    await prisma.like.delete({
      where: {
        userId_reviewId: {
          userId,
          reviewId,
        },
      },
    });

    return { liked: false };
  }

  // like
  await prisma.like.create({
    data: {
      userId,
      reviewId,
    },
  });

  return { liked: true };
};