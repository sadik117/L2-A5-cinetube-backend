import { Genre, MediaType, PriceType } from "../../generated/prisma/enums";

export interface ICreateMovie {
  type: MediaType;
  title: string;
  coverImage: string;
  synopsis: string;
  genre: Genre[];
  releaseYear: number;
  director: string;
  cast: string[];
  platform: string;
  priceType: PriceType;
  youtubeLink: string;
}