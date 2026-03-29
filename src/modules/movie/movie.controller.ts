/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import * as MovieService from "./movie.service";

export const createMovie = async (req: Request, res: Response) => {
  try {

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
  } 
  catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getMovies = async (req: Request, res: Response) => {
 try { 
  const result = await MovieService.getAllMovies();
  res.json(result);
 } 
 catch (error: any) {  
  res.status(500).json({ message: error.message });
 }
};

export const getMovie = async (req: Request, res: Response) => {
    try {
        const result = await MovieService.getSingleMovie(req.params.id as string);
        if (!result) {
            return res.status(404).json({ message: "Movie not found" });
        }
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateMovie = async (req: Request, res: Response) => {
    try {
        const result = await MovieService.updateMovie(req.params.id as string, req.body);
        res.json(result);
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

export const deleteMovie = async (req: Request, res: Response) => {
    try {
        const result = await MovieService.deleteMovie(req.params.id as string);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};  
