import { body, validationResult } from "express-validator";
import {
  MAX_LOAN_AMOUNT,
  MAX_TENURE_DAYS,
  MIN_LOAN_AMOUNT,
  MIN_TENURE_DAYS,
  LOAN_STATUS,
  USER_ROLES,
} from "../constants.js";
import { Loan } from "../models/loan.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { calculateRepayment } from "../utils/loanCalculator.js";

export const createLoanValidators = [
  body("amount")
    .isFloat({ min: MIN_LOAN_AMOUNT, max: MAX_LOAN_AMOUNT })
    .withMessage("Loan amount must be between Rs. 50,000 and Rs. 5,00,000"),
  body("tenureDays")
    .isInt({ min: MIN_TENURE_DAYS, max: MAX_TENURE_DAYS })
    .withMessage("Tenure must be between 30 and 365 days"),
];

export const calculateLoan = asyncHandler(async (req, res) => {
  const amount = Number(req.query.amount);
  const tenureDays = Number(req.query.tenureDays);
  if (
    amount < MIN_LOAN_AMOUNT ||
    amount > MAX_LOAN_AMOUNT ||
    tenureDays < MIN_TENURE_DAYS ||
    tenureDays > MAX_TENURE_DAYS
  ) {
    throw new ApiError(400, "Amount or tenure is outside allowed limits");
  }
  res
    .status(200)
    .json(new ApiResponse(200, calculateRepayment(amount, tenureDays)));
});

export const createLoan = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    throw new ApiError(400, "Validation failed", errors.array());
  if (req.user?.role !== USER_ROLES.BORROWER)
    throw new ApiError(403, "Only borrowers can apply for loans");

  const user = await User.findById(req.user._id);
  if (!user?.personalDetailsCompleted)
    throw new ApiError(400, "Complete eligible personal details first");
  if (!user.documentsUploaded)
    throw new ApiError(400, "Upload salary slip before applying");

  const existingOpenLoan = await Loan.findOne({
    borrower: req.user._id,
    status: {
      $in: [LOAN_STATUS.APPLIED, LOAN_STATUS.SANCTIONED, LOAN_STATUS.DISBURSED],
    },
  });
  if (existingOpenLoan)
    throw new ApiError(409, "You already have an active loan application");

  const { amount, tenureDays } = req.body;
  const repayment = calculateRepayment(Number(amount), Number(tenureDays));
  const loan = await Loan.create({
    borrower: req.user._id,
    amount,
    tenureDays,
    ...repayment,
    outstandingBalance: repayment.totalRepayment,
    status: LOAN_STATUS.APPLIED,
  });

  res
    .status(201)
    .json(new ApiResponse(201, { loan }, "Loan application submitted"));
});

export const getMyLoans = asyncHandler(async (req, res) => {
  if (req.user?.role !== USER_ROLES.BORROWER)
    throw new ApiError(403, "Only borrowers can access their loans");
  const loans = await Loan.find({ borrower: req.user._id }).sort({
    createdAt: -1,
  });
  res.status(200).json(new ApiResponse(200, { loans }));
});
