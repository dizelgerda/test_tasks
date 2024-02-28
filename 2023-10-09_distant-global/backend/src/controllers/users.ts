import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { constants } from "node:http2";
import bcrypt from "bcryptjs";
import User from "../models/user";
import config from "../config";
import UnauthorizedError from "../utils/errors/UnauthorizedError";
import BadRequestError from "../utils/errors/BadRequestError";
import NotFoundError from "../utils/errors/NotFoundError";
import ConflictError from "../utils/errors/ConflictError";

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { name, email, password } = req.body;

    const hash = await bcrypt.hash(password, await bcrypt.genSalt());
    const user = await User.create({ name, email, password: hash });

    res.status(constants.HTTP_STATUS_CREATED).send({ _id: user._id });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError(err.message));
    } else if (err instanceof Error && "code" in err && err.code === 11000) {
      next(new ConflictError(err.message));
    } else {
      next(err);
    }
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email })
      .select("+password")
      .orFail(new UnauthorizedError());

    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedError();
    }

    const token = jwt.sign({ _id: user._id }, config.SECRET_KEY);
    res
      .cookie("jwt", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        secure: true,
        httpOnly: true,
      })
      .send({ message: "Авторизация прошла успешно" });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError(err.message));
    } else {
      next(err);
    }
  }
}

export function logout(_req: Request, res: Response) {
  res.clearCookie("jwt").send({ message: "Выход успешен." });
}

export async function getCurrentUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { _id } = req.app.get("currentUser");

    const user = await User.findById(_id).orFail(new NotFoundError());
    res.send(user);
  } catch (err) {
    next(err);
  }
}

export async function getUserByID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { docID: userID } = req.params;

    const user = await User.findById(userID).orFail(new NotFoundError());

    res.send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(new BadRequestError(err.message));
    } else {
      next(err);
    }
  }
}
