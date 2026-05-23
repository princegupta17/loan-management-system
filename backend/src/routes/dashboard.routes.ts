import { Router } from "express";
import {
  approveLoan,
  getAdminSummary,
  getAppliedLoans,
  getDisbursedLoans,
  getSalesLeads,
  getSanctionedLoans,
  loanIdValidator,
  markDisbursed,
  rejectLoan,
  rejectValidators,
} from "../controllers/dashboard.controller.js";
import { USER_ROLES } from "../constants.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

router.use(verifyJwt);
router.get("/admin/summary", authorizeRoles(USER_ROLES.ADMIN), getAdminSummary);
router.get("/sales/leads", authorizeRoles(USER_ROLES.SALES), getSalesLeads);
router.get(
  "/sanction/loans",
  authorizeRoles(USER_ROLES.SANCTION),
  getAppliedLoans,
);
router.patch(
  "/sanction/:loanId/approve",
  authorizeRoles(USER_ROLES.SANCTION),
  loanIdValidator,
  approveLoan,
);
router.patch(
  "/sanction/:loanId/reject",
  authorizeRoles(USER_ROLES.SANCTION),
  rejectValidators,
  rejectLoan,
);
router.get(
  "/disbursement/loans",
  authorizeRoles(USER_ROLES.DISBURSEMENT),
  getSanctionedLoans,
);
router.patch(
  "/disbursement/:loanId/disburse",
  authorizeRoles(USER_ROLES.DISBURSEMENT),
  loanIdValidator,
  markDisbursed,
);
router.get(
  "/collection/loans",
  authorizeRoles(USER_ROLES.COLLECTION),
  getDisbursedLoans,
);

export default router;
