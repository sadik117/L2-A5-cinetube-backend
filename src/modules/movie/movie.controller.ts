/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import * as MovieService from "./movie.service";
import { catchAsync } from "../../utils/catchAsync";

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

    const result = await MovieService.updateMovie(req.params.id as string, req.body);
    res.json(result);

});

export const deleteMovie = catchAsync(async (req: Request, res: Response) => 
{
    const result = await MovieService.deleteMovie(req.params.id as string);
    res.json(result);

});


export const getStreamingLink = catchAsync(async (req: Request, res: Response) => {

    const userId = req.user?.id;
    const mediaId = req.params.id;

    const result = await MovieService.getStreamingLink(mediaId as string, userId as string);

    if (result.youtubeLink) {
      return res.json({
        youtubeLink: result.youtubeLink,
      });
    }    

});
