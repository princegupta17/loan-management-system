import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IPayment extends Document {
  _id: Types.ObjectId;
  loan: Types.ObjectId;
  borrower: Types.ObjectId;
  utr: string;
  amount: number;
  paidAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    loan: {
      type: Schema.Types.ObjectId,
      ref: "Loan",
      required: true,
      index: true,
    },
    borrower: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    utr: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    amount: { type: Number, required: true },
    paidAt: { type: Date, required: true },
  },
  { timestamps: true },
);

export const Payment: Model<IPayment> = mongoose.model<IPayment>(
  "Payment",
  paymentSchema,
);
