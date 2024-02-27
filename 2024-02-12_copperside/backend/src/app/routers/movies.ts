import { Router } from "express";
import {
  getMovies,
  createMovie,
  removeMovie,
  updateMovie,
  getMovieById,
} from "../controllers/movies";

const router = Router();

router.get("/", getMovies);
router.get("/:id", getMovieById);
router.post("/", createMovie);
router.delete("/:id", removeMovie);
router.patch("/:id", updateMovie);

export default router;
