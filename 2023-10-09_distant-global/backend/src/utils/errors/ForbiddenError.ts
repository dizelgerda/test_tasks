import CustomError from "./CustomError";
import { constants } from "node:http2";

export default class ForbiddenError extends CustomError {
  constructor(message: string = "Нет доступа.") {
    super(message, constants.HTTP_STATUS_FORBIDDEN);
  }
}
