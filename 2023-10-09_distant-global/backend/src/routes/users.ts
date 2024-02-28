import express from "express";
import { getCurrentUser, getUserByID } from "../controllers/users";

const router = express.Router();

router.get("/me", getCurrentUser);
router.get("/:docID", getUserByID);

export default router;
