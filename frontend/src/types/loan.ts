import { User } from "./user";

export type LoanStatus =
  | "REGISTERED"
  | "APPLIED"
  | "SANCTIONED"
  | "DISBURSED"
  | "CLOSED"
  | "REJECTED";

export interface Loan {
  _id: string;
  borrower: string | User;
  amount: number;
  tenureDays: number;
  interestRate: number;
  interestAmount: number;
  totalRepayment: number;
  totalPaid: number;
  outstandingBalance: number;
  status: LoanStatus;
  rejectionReason?: string;
  createdAt: string;
  sanctionedAt?: string;
  disbursedAt?: string;
  closedAt?: string;
}

export interface Payment {
  _id: string;
  loan: string;
  borrower: string;
  utr: string;
  amount: number;
  paidAt: string;
}
