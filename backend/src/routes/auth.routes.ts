import { Router } from "express";
import {
  login,
  loginValidators,
  me,
  signup,
  signupValidators,
} from "../controllers/auth.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/signup", signupValidators, signup);
router.post("/login", loginValidators, login);
router.get("/me", verifyJwt, me);

export default router;
