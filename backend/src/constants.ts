export const DB_NAME = "loan_management_system";

export const USER_ROLES = {
  ADMIN: "ADMIN",
  SALES: "SALES",
  SANCTION: "SANCTION",
  DISBURSEMENT: "DISBURSEMENT",
  COLLECTION: "COLLECTION",
  BORROWER: "BORROWER",
} as const;

export const LOAN_STATUS = {
  REGISTERED: "REGISTERED",
  APPLIED: "APPLIED",
  SANCTIONED: "SANCTIONED",
  DISBURSED: "DISBURSED",
  CLOSED: "CLOSED",
  REJECTED: "REJECTED",
} as const;

export const INTEREST_RATE = 12;
export const MIN_LOAN_AMOUNT = 50000;
export const MAX_LOAN_AMOUNT = 500000;
export const MIN_TENURE_DAYS = 30;
export const MAX_TENURE_DAYS = 365;
