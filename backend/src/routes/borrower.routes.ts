import { Router } from "express";
import {
  borrowerDashboard,
  personalDetailsValidators,
  savePersonalDetails,
  uploadSalarySlip,
} from "../controllers/borrower.controller.js";
import { USER_ROLES } from "../constants.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

router.use(verifyJwt, authorizeRoles(USER_ROLES.BORROWER));
router.post(
  "/personal-details",
  personalDetailsValidators,
  savePersonalDetails,
);
router.post("/salary-slip", upload.single("salarySlip"), uploadSalarySlip);
router.get("/dashboard", borrowerDashboard);

export default router;
