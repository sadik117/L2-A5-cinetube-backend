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


export const getSubscriptions = async () => {

    return await prisma.subscription.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  };

  export const getSubscriptionsAnalytics = async () => {

    const subscriptions = await prisma.subscription.findMany();

    const total = subscriptions.length;

    const active = subscriptions.filter(
      (s) => s.status === "active"
    ).length;

    const canceled = subscriptions.filter(
      (s) => s.status === "canceled"
    ).length;

    const activePercentage = total
      ? Math.round((active / total) * 100)
      : 0;

    // Plan distribution
    const planMap: Record<string, number> = {};

    subscriptions.forEach((sub) => {
      const plan = sub.plan || "Unknown";
      planMap[plan] = (planMap[plan] || 0) + 1;
    });

    const planDistribution = Object.entries(planMap).map(
      ([plan, count]) => ({
        plan,
        count,
        percentage: Math.round((count / total) * 100),
      })
    );

    return {
      total,
      active,
      canceled,
      activePercentage,
      planDistribution,
    };
  };