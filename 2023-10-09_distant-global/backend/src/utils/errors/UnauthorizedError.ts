import CustomError from "./CustomError";
import { constants } from "node:http2";

class UnauthorizedError extends CustomError {
  constructor(message: string = "Необходима авторизация.") {
    super(message, constants.HTTP_STATUS_UNAUTHORIZED);
  }
}

export default UnauthorizedError;
