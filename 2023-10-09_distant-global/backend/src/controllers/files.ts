import { Request, Response, NextFunction } from "express";
import { UploadedFile } from "express-fileupload";
import BadRequestError from "../utils/errors/BadRequestError";
import ForbiddenError from "../utils/errors/ForbiddenError";
import NotFoundError from "../utils/errors/NotFoundError";
import News from "../models/news";
import File from "../models/file";
import fs from "fs";
import path from "node:path";
import { constants } from "node:http2";
import mongoose from "mongoose";

export async function uploadFiles(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { docID } = req.params;
    const currentUser = req.app.get("currentUser");

    if (!req.files) {
      throw new BadRequestError("Фалы отсутствуют.");
    }

    const news = await News.findById(docID).orFail(new NotFoundError());

    if (String(news.owner) !== currentUser._id) {
      throw new ForbiddenError();
    }

    let { names } = req.body;
    let data = req.files.data;

    if (!Array.isArray(data)) {
      data = [data];
      names = [names];
    }

    const files = [...news.files];
    for (let key = 0; key !== data.length; key++) {
      const file = data[key] as UploadedFile;
      const fileName = names[key];

      const doc = new File({
        name: fileName,
        type: file.mimetype,
        newsID: news._id,
      });

      fs.writeFileSync(
        path.join(__dirname, "..", "..", "files", `${doc._id}-${doc.name}`),
        file.data,
      );
      await doc.save();
      files.push(doc._id);
    }

    await news.updateOne({ $set: { files } });

    res
      .status(constants.HTTP_STATUS_CREATED)
      .send({ message: "Файл сохранен." });
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

export async function getFileByID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { docID } = req.params;
    const currentUser = req.app.get("currentUser");

    const file = await File.findById(docID).orFail(new NotFoundError());
    const news = await News.findById(file.newsID).orFail(new NotFoundError());

    if (!news.published && String(news.owner) !== currentUser._id) {
      throw new ForbiddenError();
    }

    res.sendFile(
      path.join(__dirname, "..", "..", "files", `${file._id}-${file.name}`),
    );
  } catch (err) {
    next(err);
  }
}

export async function deleteFile(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { docID: fileID } = req.params;
    const currentUser = req.app.get("currentUser");

    const doc = await File.findById(fileID).orFail(new NotFoundError());
    const news = await News.findById(doc.newsID).orFail(new NotFoundError());

    if (String(news.owner) !== currentUser._id) {
      throw new ForbiddenError();
    }

    fs.unlinkSync(
      path.join(__dirname, "..", "..", "files", `${doc._id}-${doc.name}`),
    );
    await Promise.all([
      doc.deleteOne(),
      news.updateOne({ $pull: { files: doc._id } }),
    ]);

    await news.populate("files");

    res.send(news);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(new BadRequestError(err.message));
    } else {
      next(err);
    }
  }
}
