import express from "express";

import userRouter from "./users";
import authRouter from "./auth";
import newsRouter from "./news";
import filesRouter from "./files";

import auth from "../middlewares/auth";
import NotFoundError from "../utils/errors/NotFoundError";

const router = express.Router();

router.use(authRouter);
router.use(auth);

router.use("/users", userRouter);
router.use("/news", newsRouter);
router.use("/files", filesRouter);

router.use(function (_req, _res, next) {
  next(new NotFoundError());
});

export default router;
