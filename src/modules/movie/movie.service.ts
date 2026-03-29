import { prisma } from "../../lib/prisma";
import { ICreateMovie } from "./types";


export const createMovie = async (data: ICreateMovie) => {
  return await prisma.media.create({ data });
};

export const getAllMovies = async () => {
  return await prisma.media.findMany({
    include: {
      review: true,
    },
  });
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
    throw new Error("Movie not found");
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