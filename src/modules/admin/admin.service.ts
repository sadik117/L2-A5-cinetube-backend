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
  const [mostReviewed, topRated, totalMedia] = await Promise.all([
    prisma.media.findMany({
      select: {
        id: true,
        title: true,
        type: true,
        averageRating: true,
        totalReviews: true,
        priceType: true,
      },
      orderBy: {
        totalReviews: "desc",
      },
      take: 8,
    }),

    prisma.media.findMany({
      select: {
        id: true,
        title: true,
        type: true,
        averageRating: true,
        totalReviews: true,
        priceType: true,
      },
      orderBy: {
        averageRating: "desc",
      },
      take: 8,
    }),

    prisma.media.count(),
  ]);

  return {
    totalMedia,
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
          watchlist: true
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
  const [total, active, canceled] = await Promise.all([
    prisma.subscription.count(),
    prisma.subscription.count({
      where: { status: "active" },
    }),
    prisma.subscription.count({
      where: { status: "canceled" },
    }),
    prisma.subscription.aggregate({
      where: { status: "active" },
    }),
  ]);

  return {
    total,
    active,
    canceled,
    activePercentage: total > 0 ? Math.round((active / total) * 100) : 0,
  };
};