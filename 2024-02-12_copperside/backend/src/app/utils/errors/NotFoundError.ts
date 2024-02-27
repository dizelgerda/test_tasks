import CustomError from "./CustomError";
import { constants } from "node:http2";

class NotFoundError extends CustomError {
  constructor(message: string = "Ресурс не найден.") {
    super(message, constants.HTTP_STATUS_NOT_FOUND);
  }
}

export default NotFoundError;
