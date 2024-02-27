import { Response, NextFunction } from "express";
import { constants } from "node:http2";
import CustomError from "../utils/errors/CustomError";

export default function (
  err: CustomError,
  _req: unknown,
  res: Response,
  next: NextFunction,
) {
  const { statusCode, message } = err;

  if (statusCode) {
    res.status(statusCode).send({ message });
  } else {
    console.error(`Server Error ${err.name}: ${err}`);
    res
      .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: "На сервере произошла ошибка." });
  }

  next();
}
