import CustomError from "./CustomError";
import { constants } from "node:http2";

class BadRequestError extends CustomError {
  constructor(message: string = "Переданы невалидные данные.") {
    super(message, constants.HTTP_STATUS_BAD_REQUEST);
  }
}

export default BadRequestError;
