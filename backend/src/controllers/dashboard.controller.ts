import { body, param, validationResult } from "express-validator";
import { LOAN_STATUS } from "../constants.js";
import { Loan } from "../models/loan.model.js";
import { Payment } from "../models/payment.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const loanIdValidator = [
  param("loanId").isMongoId().withMessage("Invalid loan id"),
];
export const rejectValidators = [
  ...loanIdValidator,
  body("reason").trim().notEmpty().withMessage("Rejection reason is required"),
];

export const getSalesLeads = asyncHandler(async (_req, res) => {
  const appliedBorrowerIds = await Loan.distinct("borrower", {
    status: {
      $in: [
        LOAN_STATUS.APPLIED,
        LOAN_STATUS.SANCTIONED,
        LOAN_STATUS.DISBURSED,
        LOAN_STATUS.CLOSED,
      ],
    },
  });
  const users = await User.find({
    role: "BORROWER",
    _id: { $nin: appliedBorrowerIds },
  }).sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, { users }, "Sales leads fetched"));
});

export const getAppliedLoans = asyncHandler(async (_req, res) => {
  const loans = await Loan.find({ status: LOAN_STATUS.APPLIED })
    .populate("borrower", "-password")
    .sort({ createdAt: -1 });
  res
    .status(200)
    .json(new ApiResponse(200, { loans }, "Applied loans fetched"));
});

export const approveLoan = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    throw new ApiError(400, "Validation failed", errors.array());

  const loan = await Loan.findById(req.params.loanId);
  if (!loan) throw new ApiError(404, "Loan not found");
  if (loan.status !== LOAN_STATUS.APPLIED)
    throw new ApiError(409, "Only APPLIED loans can be sanctioned");

  loan.status = LOAN_STATUS.SANCTIONED;
  loan.sanctionedAt = new Date();
  loan.rejectionReason = undefined;
  await loan.save();

  res.status(200).json(new ApiResponse(200, { loan }, "Loan sanctioned"));
});

export const rejectLoan = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    throw new ApiError(400, "Validation failed", errors.array());

  const loan = await Loan.findById(req.params.loanId);
  if (!loan) throw new ApiError(404, "Loan not found");
  if (loan.status !== LOAN_STATUS.APPLIED)
    throw new ApiError(409, "Only APPLIED loans can be rejected");

  loan.status = LOAN_STATUS.REJECTED;
  loan.rejectionReason = req.body.reason;
  await loan.save();

  res.status(200).json(new ApiResponse(200, { loan }, "Loan rejected"));
});

export const getSanctionedLoans = asyncHandler(async (_req, res) => {
  const loans = await Loan.find({ status: LOAN_STATUS.SANCTIONED })
    .populate("borrower", "-password")
    .sort({ sanctionedAt: -1 });
  res
    .status(200)
    .json(new ApiResponse(200, { loans }, "Sanctioned loans fetched"));
});

export const markDisbursed = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    throw new ApiError(400, "Validation failed", errors.array());

  const loan = await Loan.findById(req.params.loanId);
  if (!loan) throw new ApiError(404, "Loan not found");
  if (loan.status !== LOAN_STATUS.SANCTIONED)
    throw new ApiError(409, "Only SANCTIONED loans can be disbursed");

  loan.status = LOAN_STATUS.DISBURSED;
  loan.disbursedAt = new Date();
  await loan.save();

  res.status(200).json(new ApiResponse(200, { loan }, "Loan disbursed"));
});

export const getDisbursedLoans = asyncHandler(async (_req, res) => {
  const loans = await Loan.find({ status: LOAN_STATUS.DISBURSED })
    .populate("borrower", "-password")
    .sort({ disbursedAt: -1 });
  const loanIds = loans.map((loan) => loan._id);
  const payments = await Payment.find({ loan: { $in: loanIds } }).sort({
    paidAt: -1,
  });

  res
    .status(200)
    .json(
      new ApiResponse(200, { loans, payments }, "Collection loans fetched"),
    );
});

export const getAdminSummary = asyncHandler(async (_req, res) => {
  const [users, applied, sanctioned, disbursed, closed, rejected] =
    await Promise.all([
      User.countDocuments(),
      Loan.countDocuments({ status: LOAN_STATUS.APPLIED }),
      Loan.countDocuments({ status: LOAN_STATUS.SANCTIONED }),
      Loan.countDocuments({ status: LOAN_STATUS.DISBURSED }),
      Loan.countDocuments({ status: LOAN_STATUS.CLOSED }),
      Loan.countDocuments({ status: LOAN_STATUS.REJECTED }),
    ]);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { users, applied, sanctioned, disbursed, closed, rejected },
        "Admin summary fetched",
      ),
    );
});
