import express from "express";
import { deleteFile, getFileByID } from "../controllers/files";

const router = express.Router();

router.get("/:docID", getFileByID);
router.delete("/:docID", deleteFile);

export default router;
