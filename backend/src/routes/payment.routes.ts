import { Router } from "express";
import {
  getLoanPayments,
  recordPayment,
  recordPaymentValidators,
} from "../controllers/payment.controller.js";
import { USER_ROLES } from "../constants.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

router.use(verifyJwt);
router.post(
  "/",
  authorizeRoles(USER_ROLES.COLLECTION),
  recordPaymentValidators,
  recordPayment,
);
router.get(
  "/:loanId",
  authorizeRoles(USER_ROLES.COLLECTION, USER_ROLES.BORROWER),
  getLoanPayments,
);

export default router;
