"use client";

import { useEffect, useState } from "react";
import { Banknote, Send } from "lucide-react";
import { RoleGuard } from "@/components/RoleGuard";
import { api } from "@/lib/axios";
import { Loan } from "@/types/loan";
import { User } from "@/types/user";

export default function DisbursementPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const load = () =>
    api
      .get("/dashboard/disbursement/loans")
      .then(({ data }) => setLoans(data.data.loans));
  useEffect(() => {
    load();
  }, []);

  const disburse = async (id: string) => {
    await api.patch(`/dashboard/disbursement/${id}/disburse`);
    load();
  };

  return (
    <RoleGuard roles={["DISBURSEMENT"]}>
      <h1 className="mb-5 flex items-center gap-2 text-2xl font-bold">
        <Banknote size={22} /> Disbursement Queue
      </h1>
      <div className="grid gap-4">
        {loans.map((loan) => {
          const borrower = loan.borrower as User;
          return (
            <div
              className="panel flex flex-wrap items-center justify-between gap-4"
              key={loan._id}
            >
              <div>
                <strong>{borrower.fullName}</strong>
                <p className="text-sm text-zinc-600">
                  Approved amount Rs. {loan.amount.toLocaleString("en-IN")} |
                  Repayment Rs. {loan.totalRepayment.toLocaleString("en-IN")}
                </p>
              </div>
              <button className="btn" onClick={() => disburse(loan._id)}>
                <Send size={16} /> Mark Disbursed
              </button>
            </div>
          );
        })}
        {!loans.length && (
          <div className="panel text-sm text-zinc-600">
            No SANCTIONED loans awaiting disbursement.
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
