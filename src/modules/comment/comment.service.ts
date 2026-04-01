import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";


// create comment or reply
export const createComment = async (
  userId: string,
  reviewId: string,
  content: string,
  parentId?: string
) => {
  // check review exists
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) throw new AppError("Review not found", 404);

  // if reply → check parent exists
  if (parentId) {
    const parent = await prisma.comment.findUnique({ where: { id: parentId } });
    if (!parent) throw new AppError("Parent comment not found", 404);
  }

  return await prisma.comment.create({
    data: {
      content: content as string,
      userId: userId as string,
      reviewId: reviewId as string,
      parentId: parentId as string,
    },
  });
};


// get comments nested
export const getCommentsByReview = async (reviewId: string) => {
  return await prisma.comment.findMany({
    where: {
      reviewId,
      isApproved: true,
      parentId: null, // only root comments
    },
    include: {
      user: true,
      likes: true,
      replies: {
        where: { isApproved: true },
        include: {
          user: true,
          likes: true,
          replies: {
            include: {
              user: true,
              likes: true,
              replies: {    // 3-level nesting (can go deeper if needed)
                include: {
                  user: true,
                  likes: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });
};


// get all comments by admin (no nesting, for moderation)
export const getAllComments = async () => {
  return await prisma.comment.findMany({
    include: {
      user: true,
      review: true,
    },
    orderBy: { createdAt: "desc" },
  });
};


// approve comment by admin
export const approveComment = async (id: string) => {
  return await prisma.comment.update({
    where: { id },
    data: { isApproved: true },
  });
};


// update comment that is not approved by owner
export const updateComment = async (
  id: string, userId: string, content: string
) => {
  const comment = await prisma.comment.findUnique({ where: { id } });

  if (!comment) throw new AppError("Comment not found", 404);

  if (comment.userId !== userId) {
    throw new AppError("Unauthorized", 403);
  }

  if (comment.isApproved) {
    throw new AppError("Cannot edit approved comment", 400);
  }

  return await prisma.comment.update({
    where: { id },
    data: { content },
  });
};


// user can delete own comment, admin can delete any comment
export const deleteComment = async (id: string, userId?: string) => {
  const comment = await prisma.comment.findUnique({ where: { id } });

  if (!comment) throw new AppError("Comment not found", 404);

  if (userId && comment.userId !== userId) {
    throw new AppError("Unauthorized", 403);
  }

  return await prisma.comment.delete({
    where: { id },
  });
};
