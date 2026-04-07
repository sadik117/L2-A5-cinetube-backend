import { z } from "zod";

export const createMediaSchema = z.object({
  title: z.string().min(1),
  type: z.enum(["Movie", "Series"]),
  priceType: z.enum(["Free", "Premium"]),
  releaseYear: z.coerce.number(), // string to number
  director: z.string().min(1),
  synopsis: z.string().min(1),
  platform: z.string().min(1),
  youtubeLink: z.string().url(),

  // coming as string from form data
  cast: z
    .string()
    .transform((val) => JSON.parse(val))
    .pipe(z.array(z.string())),

  genre: z
    .string()
    .transform((val) => JSON.parse(val))
    .pipe(z.array(z.string())),

  coverImage: z.string().url(),
});