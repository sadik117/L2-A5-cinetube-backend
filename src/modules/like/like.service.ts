import { prisma } from "../../lib/prisma";


// Like/unlike review
export const toggleLikeReview = async (userId: string, reviewId: string) => {

  // check if already liked
  const existing = await prisma.reviewLike.findUnique({
    where: {
      userId_reviewId: {
        userId,
        reviewId,
      },
    },
  });

  if (existing) {
    // unlike
    await prisma.reviewLike.delete({
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
  await prisma.reviewLike.create({
    data: {
      userId,
      reviewId,
    },
  });

  return { liked: true };
};


// Like/unlike comment
export const toggleLikeComment = async (commentId: string, userId: string) => {

  const existing = await prisma.commentLike.findUnique({ where: { userId_commentId: { userId, commentId } } });

  if (existing) {
    await prisma.commentLike.delete({ where: { userId_commentId: { userId, commentId } } });
    return { liked: false };
  }

  await prisma.commentLike.create({ data: { userId, commentId } });
  return { liked: true };
  
};