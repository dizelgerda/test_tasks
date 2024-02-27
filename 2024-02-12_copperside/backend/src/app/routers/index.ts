import { Router } from "express";
import NotFoundError from "../utils/errors/NotFoundError";
import routerMovies from "./movies";
import { login, createUser } from "../controllers/users";
import fakeAuth from "../middlewares/fakeAuth";

const router = Router();

router.post("/sign-in", login);
router.post("/sign-up", createUser);

// FAKE AUTH
router.use(fakeAuth);

router.use("/movies", routerMovies);
router.use(() => {
  throw new NotFoundError("Page not found.");
});

export default router;
