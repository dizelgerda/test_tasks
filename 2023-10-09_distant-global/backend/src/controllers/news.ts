import { Request, Response, NextFunction } from "express";
import { constants } from "node:http2";
import News from "../models/news";
import File from "../models/file";
import fs from "fs";
import path from "node:path";
import mongoose from "mongoose";
import BadRequestError from "../utils/errors/BadRequestError";
import NotFoundError from "../utils/errors/NotFoundError";
import ForbiddenError from "../utils/errors/ForbiddenError";

export async function createNews(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { text, publishedAt } = req.body;
    const currentUser = req.app.get("currentUser");

    const news = await News.create({
      text,
      published: publishedAt ? false : true,
      publishedAt,
      owner: currentUser._id,
    });

    res.status(constants.HTTP_STATUS_CREATED).send(news);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError(err.message));
    } else {
      next(err);
    }
  }
}

export async function getNews(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const news = await News.find({ published: true }).sort({ createdAt: -1 });

    res.send(news);
  } catch (err) {
    next(err);
  }
}

export async function getNewsByID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { docID: newsID } = req.params;
    const currentUser = req.app.get("currentUser");

    const news = await News.findById(newsID)
      .populate("files")
      .orFail(new NotFoundError());

    if (!news.published && String(news.owner) !== currentUser._id) {
      throw new ForbiddenError();
    }

    res.send(news);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(new BadRequestError(err.message));
    } else {
      next(err);
    }
  }
}

export async function getNewsByUserID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const currentUser = req.app.get("currentUser");
    const { userID } = req.params;

    const [publishedNews, unpublishedNews] = await Promise.all([
      News.find({ owner: currentUser._id, published: true }).sort({
        publishedAt: -1,
      }),
      userID === currentUser._id
        ? News.find({ owner: currentUser._id, published: false }).sort({
            createdAt: 1,
          })
        : [],
    ]);

    res.send({ publishedNews, unpublishedNews });
  } catch (err) {
    next(err);
  }
}

export async function deleteNews(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { docID: newsID } = req.params;
    const currentUser = req.app.get("currentUser");

    const news = await News.findById(newsID).orFail(new NotFoundError());

    if (String(news.owner) !== currentUser._id) {
      throw new ForbiddenError();
    }

    for (const fileID of news.files as mongoose.Schema.Types.ObjectId[]) {
      const doc = await File.findById(fileID).orFail(new NotFoundError());

      fs.unlinkSync(
        path.join(__dirname, "..", "..", "files", `${doc._id}-${doc.name}`),
      );

      await doc.deleteOne();
    }

    await news.deleteOne();
    res.send(news);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(new BadRequestError(err.message));
    } else {
      next(err);
    }
  }
}

export async function updateNews(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { docID: newsID } = req.params;
    const currentUser = req.app.get("currentUser");
    const { text, publishedAt } = req.body;

    const news = await News.findById(newsID).orFail(new NotFoundError());

    if (String(news.owner) !== currentUser._id) {
      throw new ForbiddenError();
    }

    if (news.published) {
      await news.updateOne({ text });
    } else {
      await news.updateOne({ text, published: false, publishedAt });
    }

    res.send(news);
  } catch (err) {
    if (
      err instanceof mongoose.Error.CastError ||
      err instanceof mongoose.Error.ValidationError
    ) {
      next(new BadRequestError(err.message));
    } else {
      next(err);
    }
  }
}
