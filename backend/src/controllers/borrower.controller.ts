import path from "path";
import { fileURLToPath } from "url";
import { body, validationResult } from "express-validator";
import { LOAN_STATUS, USER_ROLES } from "../constants.js";
import { Loan, LoanStatus } from "../models/loan.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { PAN_REGEX, runBre } from "../utils/breEngine.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const personalDetailsValidators = [
  body("fullName").trim().notEmpty().withMessage("Full name is required"),
  body("pan")
    .trim()
    .custom((value) => PAN_REGEX.test(String(value).toUpperCase()))
    .withMessage("PAN format is invalid"),
  body("dob").isISO8601().withMessage("Date of birth is required"),
  body("monthlySalary")
    .isFloat({ min: 0 })
    .withMessage("Monthly salary must be a positive number"),
  body("employmentMode")
    .isIn(["Salaried", "Self-Employed", "Unemployed"])
    .withMessage("Employment mode is invalid"),
];

export const savePersonalDetails = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    throw new ApiError(400, "Validation failed", errors.array());
  if (req.user?.role !== USER_ROLES.BORROWER)
    throw new ApiError(403, "Only borrowers can submit personal details");

  const { fullName, pan, dob, monthlySalary, employmentMode } = req.body;
  runBre({ pan, dob, monthlySalary: Number(monthlySalary), employmentMode });

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      fullName,
      pan: String(pan).toUpperCase(),
      dob,
      monthlySalary,
      employmentMode,
      personalDetailsCompleted: true,
    },
    { new: true },
  );

  res
    .status(200)
    .json(new ApiResponse(200, { user }, "Personal details accepted"));
});

export const uploadSalarySlip = asyncHandler(async (req, res) => {
  if (req.user?.role !== USER_ROLES.BORROWER)
    throw new ApiError(403, "Only borrowers can upload salary slips");
  if (!req.file) throw new ApiError(400, "Salary slip file is required");

  const relativePath = path
    .relative(path.resolve(__dirname, "../.."), req.file.path)
    .replace(/\\/g, "/");
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { salarySlipPath: relativePath, documentsUploaded: true },
    { new: true },
  );

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user, path: relativePath },
        "Salary slip uploaded",
      ),
    );
});

export const borrowerDashboard = asyncHandler(async (req, res) => {
  if (req.user?.role !== USER_ROLES.BORROWER)
    throw new ApiError(403, "Only borrowers can access borrower dashboard");
  const user = await User.findById(req.user._id);
  const loans = await Loan.find({ borrower: req.user._id }).sort({
    createdAt: -1,
  });
  const visibleStatuses: LoanStatus[] = [
    LOAN_STATUS.APPLIED,
    LOAN_STATUS.SANCTIONED,
    LOAN_STATUS.DISBURSED,
    LOAN_STATUS.CLOSED,
    LOAN_STATUS.REJECTED,
  ];
  const activeLoan = loans.find((loan) =>
    visibleStatuses.includes(loan.status),
  );
  res.status(200).json(new ApiResponse(200, { user, loans, activeLoan }));
});
