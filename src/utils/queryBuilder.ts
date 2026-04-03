/* eslint-disable @typescript-eslint/no-explicit-any */

export const buildMediaQuery = (query: any) => {
  const {
    search,
    genre,
    director,
    cast,
    platform,
    minYear,
    maxYear,
  } = query;

  const where: any = {
    AND: [],
  };

  
  if (search) {
    where.AND.push({
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { director: { contains: search, mode: "insensitive" } },
        { platform: { contains: search, mode: "insensitive" } },
      ],
    });
  }


  if (genre) {
    where.AND.push({
      genre: { has: genre },
    });
  }


  if (director) {
    where.AND.push({
      director: { contains: director, mode: "insensitive" },
    });
  }


  if (cast) {
    where.AND.push({
      cast: { has: cast },
    });
  }


  if (platform) {
    where.AND.push({
      platform: { contains: platform, mode: "insensitive" },
    });
  }


  if (minYear || maxYear) {
    where.AND.push({
      releaseYear: {
        gte: minYear ? Number(minYear) : undefined,
        lte: maxYear ? Number(maxYear) : undefined,
      },
    });
  }

  return where;
};