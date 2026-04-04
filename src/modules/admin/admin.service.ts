import { prisma } from "../../lib/prisma";

export const getDashboardStats = async () => {
  const [
    totalUsers,
    totalMedia,
    totalReviews,
    pendingReviews,
    totalSubscriptions,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.media.count(),
    prisma.review.count(),
    prisma.review.count({ where: { isApproved: false } }),
    prisma.subscription.count({ where: { status: "active" } }),
  ]);

  return {
    totalUsers,
    totalMedia,
    totalReviews,
    pendingReviews,
    totalSubscriptions,
  };
};


export const getMediaAnalytics = async () => {
  const mostReviewed = await prisma.media.findMany({
    orderBy: {
      totalReviews: "desc",
    },
    take: 10,
  });

  const topRated = await prisma.media.findMany({
    orderBy: {
      averageRating: "desc",
    },
    take: 10,
  });

  return {
    mostReviewed,
    topRated,
  };
};


export const getUserActivity = async () => {
  return await prisma.user.findMany({
    include: {
      _count: {
        select: {
          reviews: true,
          comments: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });
};


export const getSubscriptionAnalytics = async () => {
  const total = await prisma.subscription.count();

  const active = await prisma.subscription.count({
    where: { status: "active" },
  });

  const canceled = await prisma.subscription.count({
    where: { status: "canceled" },
  });

  return {
    total,
    active,
    canceled,
  };
};