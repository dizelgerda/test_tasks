import { NextFunction, Request, Response } from "express";
import * as mdbApi from "../utils/mdbApi";
import db from "../../db";
import movies from "../../db/schemas/movies";
import { constants } from "node:http2";
import { and, eq, inArray } from "drizzle-orm";

export function getMovies(req: Request, res: Response, next: NextFunction) {
  const { search } = req.query;

  if (search) {
    searchMovies(search as string, req, res, next);
  } else {
    getMoviesByUser(req, res, next);
  }
}

async function getMoviesByUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const currentUser = req.app.get("currentUser");

    const ratedMovies = await db
      .select()
      .from(movies)
      .where(eq(movies.owner, currentUser.id));

    const results = await Promise.all(
      ratedMovies.map(async (ratingData) => {
        return {
          ...(await mdbApi.findById(ratingData.mdbID)),
          userSaved: true,
          userRating: ratingData.rating,
        };
      }),
    );

    res.send(results);
  } catch (err) {
    next(err);
  }
}

async function searchMovies(
  search: string,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const {
      data: { Search = [], totalResults, Error },
    } = await mdbApi.searchMany(search, Number(req.query.page));
    const currentUser = req.app.get("currentUser");

    const moviesID = Search.map(({ imdbID }: { imdbID: string }) => imdbID);
    const savedMovies = await db
      .select()
      .from(movies)
      .where(
        and(eq(movies.owner, currentUser.id), inArray(movies.mdbID, moviesID)),
      );

    const moviesData = Search.map((data: { imdbID: string }) => {
      const savedMovie = savedMovies.find(({ mdbID }) => mdbID === data.imdbID);

      if (savedMovie) {
        return {
          ...data,
          userSaved: true,
          userRating: savedMovie.rating,
        };
      }
      return { ...data };
    });

    res.send({
      data: !Error ? moviesData : [],
      totalResults: !Error ? totalResults : 0,
    });
  } catch (err) {
    next(err);
  }
}

export async function getMovieById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id: mdbID } = req.params;
    const currentUser = req.app.get("currentUser");

    const [movieData, ratedData] = await Promise.all([
      mdbApi.findById(mdbID),
      db
        .select()
        .from(movies)
        .where(and(eq(movies.mdbID, mdbID), eq(movies.owner, currentUser.id))),
    ]);

    if (ratedData[0]) {
      Object.assign(movieData, {
        userSaved: true,
        userRating: ratedData[0].rating,
      });
    }

    res.send(movieData);
  } catch (err) {
    next(err);
  }
}

export async function createMovie(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const currentUser = req.app.get("currentUser");
    const { mdbID, rating } = req.body;

    await db.insert(movies).values({
      owner: currentUser.id,
      mdbID,
      rating,
    });

    res
      .status(constants.HTTP_STATUS_CREATED)
      .send({ message: "The rating is saved" });
  } catch (err) {
    next(err);
  }
}

export async function updateMovie(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id: mdbID } = req.params;
    const currentUser = req.app.get("currentUser");
    const { rating } = req.body;

    await db
      .update(movies)
      .set({ rating })
      .where(and(eq(movies.mdbID, mdbID), eq(movies.owner, currentUser.id)));

    res.send({ message: "The rating is updated" });
  } catch (err) {
    next(err);
  }
}

export async function removeMovie(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id: mdbID } = req.params;
    const currentUser = req.app.get("currentUser");

    await db
      .delete(movies)
      .where(and(eq(movies.mdbID, mdbID), eq(movies.owner, currentUser.id)));

    res.send({ message: "The rating is deleted" });
  } catch (err) {
    next(err);
  }
}
