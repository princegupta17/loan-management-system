import { Router } from "express";
import {
  createLoan,
  createLoanValidators,
  calculateLoan,
  getMyLoans,
} from "../controllers/loan.controller.js";
import { USER_ROLES } from "../constants.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

router.use(verifyJwt);
router.get("/calculate", authorizeRoles(USER_ROLES.BORROWER), calculateLoan);
router.post(
  "/",
  authorizeRoles(USER_ROLES.BORROWER),
  createLoanValidators,
  createLoan,
);
router.get("/my", authorizeRoles(USER_ROLES.BORROWER), getMyLoans);

export default router;
