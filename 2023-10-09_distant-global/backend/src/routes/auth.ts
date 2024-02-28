import { Router } from "express";
import { createUser, login, logout } from "../controllers/users";

const router = Router();

router.post("/sign-up", createUser);
router.post("/sign-in", login);
router.post("/logout", logout);

export default router;
