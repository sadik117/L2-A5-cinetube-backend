/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { ICreateMovie } from "./movie.interface";
import { buildMediaQuery } from "../../utils/queryBuilder";
import { getPagination } from "../../utils/pagination";


export const createMovie = async (data: ICreateMovie) => {
  return await prisma.media.create({ data });
};


export const getAllMovies = async (query: any) => {
  const { minRating, maxRating, sort } = query;

  const where = buildMediaQuery(query);
  const { page, limit, skip } = getPagination(query);

  // Fetch from DB
  const movies = await prisma.media.findMany({
    where,
    skip,
    take: limit,
    include: {
      review: true,
      _count: {
        select: { review: true },
      },
    },
  });

  // Total count for pagination
  const total = await prisma.media.count({ where });

  // Format with rating
  let formatted = movies.map((movie) => {
    const totalReviews = movie.review.length;
    const avg =
      totalReviews > 0
        ? movie.review.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

    return {
      ...movie,
      averageRating: Number(avg.toFixed(1)),
      totalReviews,
    };
  });

  // Rating filter
  if (minRating || maxRating) {
    formatted = formatted.filter((m) => {
      return (
        (!minRating || m.averageRating >= Number(minRating)) &&
        (!maxRating || m.averageRating <= Number(maxRating))
      );
    });
  }

  // Sorting
  if (sort === "topRated") {
    formatted.sort((a, b) => b.averageRating - a.averageRating);
  }

  if (sort === "mostReviewed") {
    formatted.sort((a, b) => b.totalReviews - a.totalReviews);
  }

  if (sort === "latest") {
    formatted.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    data: formatted,
  };
};


export const getSingleMovie = async (id: string) => {
  return await prisma.media.findUnique({
    where: { id },
    include: {
      review: true,
    },
  });
};


export const updateMovie = async (id: string, data: ICreateMovie) => {
  // check if movie exists first
  const existingMovie = await prisma.media.findUnique({
    where: { id },
  });

  if (!existingMovie) {
    throw new AppError("Movie not found", 404);
  }

  return await prisma.media.update({
    where: { id },
    data,
  });
};


export const deleteMovie = async (id: string) => {
  return await prisma.media.delete({
    where: { id },
  });
};
