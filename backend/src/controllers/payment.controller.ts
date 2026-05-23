import { body, validationResult } from "express-validator";
import { LOAN_STATUS, USER_ROLES } from "../constants.js";
import { Loan } from "../models/loan.model.js";
import { Payment } from "../models/payment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const recordPaymentValidators = [
  body("loanId").isMongoId().withMessage("Valid loan id is required"),
  body("utr").trim().notEmpty().withMessage("UTR is required"),
  body("amount")
    .isFloat({ gt: 0 })
    .withMessage("Payment amount must be greater than zero"),
  body("date").isISO8601().withMessage("Valid payment date is required"),
];

export const recordPayment = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    throw new ApiError(400, "Validation failed", errors.array());

  const { loanId, utr, amount, date } = req.body;
  const loan = await Loan.findById(loanId);
  if (!loan) throw new ApiError(404, "Loan not found");
  if (loan.status !== LOAN_STATUS.DISBURSED)
    throw new ApiError(
      409,
      "Payments can be recorded only for DISBURSED loans",
    );

  const normalizedUtr = String(utr).toUpperCase();
  const duplicate = await Payment.findOne({ utr: normalizedUtr });
  if (duplicate) throw new ApiError(409, "UTR already exists");

  const paymentAmount = Number(amount);
  if (paymentAmount > loan.outstandingBalance) {
    throw new ApiError(400, "Payment cannot exceed outstanding balance");
  }

  const payment = await Payment.create({
    loan: loan._id,
    borrower: loan.borrower,
    utr: normalizedUtr,
    amount: paymentAmount,
    paidAt: date,
  });

  loan.totalPaid = Number((loan.totalPaid + paymentAmount).toFixed(2));
  loan.outstandingBalance = Number(
    (loan.totalRepayment - loan.totalPaid).toFixed(2),
  );
  if (loan.outstandingBalance === 0) {
    loan.status = LOAN_STATUS.CLOSED;
    loan.closedAt = new Date();
  }
  await loan.save();

  res
    .status(201)
    .json(new ApiResponse(201, { payment, loan }, "Payment recorded"));
});

export const getLoanPayments = asyncHandler(async (req, res) => {
  if (req.user?.role === USER_ROLES.BORROWER) {
    const loan = await Loan.findOne({
      _id: req.params.loanId,
      borrower: req.user._id,
    });
    if (!loan)
      throw new ApiError(403, "You can view payments only for your own loans");
  }
  const payments = await Payment.find({ loan: req.params.loanId }).sort({
    paidAt: -1,
  });
  res.status(200).json(new ApiResponse(200, { payments }));
});
