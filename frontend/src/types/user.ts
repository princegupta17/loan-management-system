export type UserRole =
  | "ADMIN"
  | "SALES"
  | "SANCTION"
  | "DISBURSEMENT"
  | "COLLECTION"
  | "BORROWER";

export interface User {
  id?: string;
  _id?: string;
  fullName: string;
  email: string;
  role: UserRole;
  pan?: string;
  dob?: string;
  monthlySalary?: number;
  employmentMode?: "Salaried" | "Self-Employed" | "Unemployed";
  salarySlipPath?: string;
  personalDetailsCompleted?: boolean;
  documentsUploaded?: boolean;
}
