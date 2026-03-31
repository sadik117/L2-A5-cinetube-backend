import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";

export const addToWatchlist = async (userId: string, mediaId: string) => {
  // check if media exists
  const media = await prisma.media.findUnique({ where: { id: mediaId } });
  if (!media) {
    throw new AppError("Movie or Series not found", 404);
  }

  // check if already in watchlist
  const existing = await prisma.watchlist.findUnique({
    where: {
      userId_mediaId: { userId, mediaId }
    }
  });

  if (existing) {
    throw new AppError("This title is already in your watchlist", 400);
  }

  const watchlistEntry = await prisma.watchlist.create({
    data: {
      userId,
      mediaId,
    },
    include: {
      media: {
        select: {
          id: true,
          title: true,
          type: true,
          coverImage: true,
          releaseYear: true,
          averageRating: true,
        }
      }
    }
  });

  return watchlistEntry;
};


export const removeFromWatchlist = async (userId: string, mediaId: string) => {
  const deleted = await prisma.watchlist.delete({
    where: {
      userId_mediaId: { userId, mediaId }
    },
    include: {
      media: {
        select: { title: true }
      }
    }
  });

  if (!deleted) {
    throw new AppError("Item not found in watchlist", 404);
  }

  return deleted;
};


export const getUserWatchlist = async (userId: string) => {
  return await prisma.watchlist.findMany({
    where: { userId },
    include: {
      media: {
        select: {
          id: true,
          title: true,
          type: true,
          coverImage: true,
          releaseYear: true,
          averageRating: true,
          priceType: true,
          youtubeLink: true,
        }
      }
    }
  });
};