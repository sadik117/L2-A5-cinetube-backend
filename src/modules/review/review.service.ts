import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { IReview, IUpdateReview } from "./review.interface";

export const createReview = async (userId: string, data: IReview) => {
  return await prisma.review.create({
    data: {
      ...data,
      userId,
      isSpoiler: data.isSpoiler || false,
    },
  });
};


// only approved reviews of users 
export const getReviewsByMedia = async (mediaId: string) => {
  return await prisma.review.findMany({
    where: {
      mediaId,
      isApproved: true,
    },
    include: {
      user: true,
      _count: {
        select: {likes: true},
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};


// get users own reviews including unpublished
export const getUserReviews = async (userId: string) => {
  return await prisma.review.findMany({
    where: {
      userId,
    },
    include: {
      media: true,
      _count: {
        select: {likes: true},
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};


// get all reviews by admin including pending
export const getAllReviews = async () => {
  return await prisma.review.findMany({
    include: {
      user: true,
      media: true,
      _count: {
        select: {likes: true},
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};


// approve review by admin
export const approveReview = async (id: string) => {
  return await prisma.review.update({
    where: { id },
    data: { isApproved: true },
  });
};


// update review only for unpublished reviews
export const updateReview = async (id: string, userId: string, data: IUpdateReview) => {
  // check if review exists and belongs to user
  const review = await prisma.review.findUnique({
    where: { id },
  });

  if (!review) {
    throw new AppError("Review not found", 404);
  }

  if (review.userId !== userId) {
    throw new AppError("Unauthorized: You can only edit your own reviews", 403);
  }

  if (review.isApproved) {
    throw new AppError("Cannot edit approved reviews", 400);
  }

  return await prisma.review.update({
    where: { id },
    data: {
      rating: data.rating || review.rating,
      content: data.content || review.content,
      tags: data.tags !== undefined ? data.tags : review.tags,
      isSpoiler: data.isSpoiler !== undefined ? data.isSpoiler : review.isSpoiler,
      updatedAt: new Date(),
    },
  });
};

export const deleteReview = async (id: string, userId?: string) => {
  // check ownership for users deleting their own reviews
  if (userId) {
    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new AppError("Review not found", 404);
    }

    if (review.userId !== userId) {
      throw new AppError("Unauthorized: You can only delete your own reviews", 403);
    }
  }

  return await prisma.review.delete({
    where: { id },
  });
};