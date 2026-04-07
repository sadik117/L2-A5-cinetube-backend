/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import * as MovieService from "./movie.service";
import { catchAsync } from "../../utils/catchAsync";
import cloudinary from "../../lib/cloudinary";

export const createMovie = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const file = req.file;

  const result = await MovieService.createMovie(data, file);

  res.status(201).json({
    status: "success",
    message: "Movie created successfully",
    data: result,
  });
});

export const getMovies = catchAsync(async (req: Request, res: Response) => {
  const result = await MovieService.getAllMovies(req.query);

  res.json({
    success: true,
    message: "Movies fetched successfully",
    ...result,
  });
});

export const getMovie = catchAsync(async (req: Request, res: Response) => {
  const result = await MovieService.getSingleMovie(req.params.id as string);

  if (!result) {
    return res.status(404).json({ message: "Movie not found" });
  }

  res.json(result);
});

export const updateMovie = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  let imageUrl: string | undefined;

  // Handle new image upload if a file is provided
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "cinetube",
    });
    imageUrl = result.secure_url;
  }

  // Build update data 
  const data: any = {};

  if (req.body.title) data.title = req.body.title;
  if (req.body.type) data.type = req.body.type;
  if (req.body.priceType) data.priceType = req.body.priceType;
  if (req.body.releaseYear) data.releaseYear = Number(req.body.releaseYear);
  if (req.body.director !== undefined) data.director = req.body.director;
  if (req.body.synopsis !== undefined) data.synopsis = req.body.synopsis;
  if (req.body.platform !== undefined) data.platform = req.body.platform;
  if (req.body.youtubeLink !== undefined) data.youtubeLink = req.body.youtubeLink;

  // Handle arrays
  if (req.body.cast) {
    try {
      data.cast = JSON.parse(req.body.cast);
    } catch (err) {
      console.log(err);
      data.cast = [];
    }
  }
  if (req.body.genre) {
    try {
      data.genre = JSON.parse(req.body.genre);
    } catch (err) {
      console.log(err);
      data.genre = [];
    }
  }

  // Handle coverImage - This was the main issue
  if (imageUrl) {
    data.coverImage = imageUrl;                    // New image uploaded
  } else if (req.body.coverImage) {
    data.coverImage = req.body.coverImage;         // Keep existing image
  }

  // Prevent empty update
  if (Object.keys(data).length === 0) {
    return res.status(400).json({ message: "No data provided for update" });
  }

  const result = await MovieService.updateMovie(id as string, data);

  res.json(result);
});

export const deleteMovie = catchAsync(async (req: Request, res: Response) => {
  const result = await MovieService.deleteMovie(req.params.id as string);
  res.json(result);
});

export const getStreamingLink = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const mediaId = req.params.id;

    const result = await MovieService.getStreamingLink(
      mediaId as string,
      userId as string,
    );

    if (result.youtubeLink) {
      return res.json({
        youtubeLink: result.youtubeLink,
      });
    }
  },
);
