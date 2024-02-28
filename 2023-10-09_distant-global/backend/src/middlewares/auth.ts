import UnauthorizedError from "../utils/errors/UnauthorizedError";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import config from "../config";

export default function (req: Request, res: Response, next: NextFunction) {
  try {
    const { jwt: token } = req.cookies;

    if (!jwt) {
      throw new Error();
    }

    const payload = jwt.verify(token, config.SECRET_KEY);
    req.app.set("currentUser", payload);
    next();
  } catch {
    req.app.set("currentUser", null);
    next(new UnauthorizedError());
  }
}
