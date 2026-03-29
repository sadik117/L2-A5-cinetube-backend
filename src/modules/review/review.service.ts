import { prisma } from "../../lib/prisma";
import { IReview, IUpdateReview } from "./types";

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
    throw new Error("Review not found");
  }

  if (review.userId !== userId) {
    throw new Error("Unauthorized: You can only edit your own reviews");
  }

  if (review.isApproved) {
    throw new Error("Cannot edit approved reviews");
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
      throw new Error("Review not found");
    }

    if (review.userId !== userId) {
      throw new Error("Unauthorized: You can only delete your own reviews");
    }
  }

  return await prisma.review.delete({
    where: { id },
  });
};