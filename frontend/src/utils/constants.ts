import { UserRole } from "@/types/user";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const ROLE_HOME: Record<UserRole, string> = {
  ADMIN: "/admin",
  SALES: "/sales",
  SANCTION: "/sanction",
  DISBURSEMENT: "/disbursement",
  COLLECTION: "/collection",
  BORROWER: "/borrower/personal-details",
};

export const modules = [
  { href: "/admin", label: "Admin", roles: ["ADMIN"] },
  { href: "/sales", label: "Sales", roles: ["ADMIN", "SALES"] },
  { href: "/sanction", label: "Sanction", roles: ["ADMIN", "SANCTION"] },
  {
    href: "/disbursement",
    label: "Disbursement",
    roles: ["ADMIN", "DISBURSEMENT"],
  },
  { href: "/collection", label: "Collection", roles: ["ADMIN", "COLLECTION"] },
  { href: "/borrower/dashboard", label: "Borrower", roles: ["BORROWER"] },
] as const;
