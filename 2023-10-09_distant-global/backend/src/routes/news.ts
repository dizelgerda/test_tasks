import { Router } from "express";
import {
  createNews,
  getNewsByUserID,
  getNewsByID,
  deleteNews,
  updateNews,
  getNews,
} from "../controllers/news";
import { uploadFiles } from "../controllers/files";

const router = Router();

router.get("/", getNews);
router.get("/owner/:userID", getNewsByUserID);
router.get("/:docID", getNewsByID);

router.post("/", createNews);
router.post("/:docID/files", uploadFiles);

router.patch("/:docID", updateNews);
router.delete("/:docID", deleteNews);

export default router;
