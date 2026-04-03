/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import * as MovieService from "./movie.service";
import { catchAsync } from "../../utils/catchAsync";

export const createMovie = catchAsync(async (req: Request, res: Response) => {

    const { type, title, coverImage, synopsis, genre, releaseYear, director, cast, platform, priceType, youtubeLink } = req.body;
    
    // validate required fields
    if (!type || !title || !coverImage || !synopsis || !genre || !releaseYear || !director || !cast || !platform || !priceType || !youtubeLink) {
      return res.status(400).json({ 
        message: "Missing required fields",
        required: ["type", "title", "coverImage", "synopsis", "genre", "releaseYear", "director", "cast", "platform", "priceType", "youtubeLink"]
      });
    }

    const result = await MovieService.createMovie(req.body);
    res.status(201).json(result);
    
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

    const result = await MovieService.updateMovie(req.params.id as string, req.body);
    res.json(result);

});

export const deleteMovie = catchAsync(async (req: Request, res: Response) => {

    const result = await MovieService.deleteMovie(req.params.id as string);
    res.json(result);

});
