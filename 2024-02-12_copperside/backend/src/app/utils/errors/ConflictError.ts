import CustomError from "./CustomError";
import { constants } from "node:http2";

export default class ConflictError extends CustomError {
  constructor(message: string) {
    super(message, constants.HTTP_STATUS_CONFLICT);
  }
}
