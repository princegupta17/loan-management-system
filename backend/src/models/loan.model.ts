import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { INTEREST_RATE, LOAN_STATUS } from "../constants.js";

export type LoanStatus = (typeof LOAN_STATUS)[keyof typeof LOAN_STATUS];

export interface ILoan extends Document {
  _id: Types.ObjectId;
  borrower: Types.ObjectId;
  amount: number;
  tenureDays: number;
  interestRate: number;
  interestAmount: number;
  totalRepayment: number;
  totalPaid: number;
  outstandingBalance: number;
  status: LoanStatus;
  rejectionReason?: string;
  sanctionedAt?: Date;
  disbursedAt?: Date;
  closedAt?: Date;
}

const loanSchema = new Schema<ILoan>(
  {
    borrower: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    amount: { type: Number, required: true },
    tenureDays: { type: Number, required: true },
    interestRate: { type: Number, default: INTEREST_RATE },
    interestAmount: { type: Number, required: true },
    totalRepayment: { type: Number, required: true },
    totalPaid: { type: Number, default: 0 },
    outstandingBalance: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(LOAN_STATUS),
      default: LOAN_STATUS.APPLIED,
    },
    rejectionReason: String,
    sanctionedAt: Date,
    disbursedAt: Date,
    closedAt: Date,
  },
  { timestamps: true },
);

export const Loan: Model<ILoan> = mongoose.model<ILoan>("Loan", loanSchema);
