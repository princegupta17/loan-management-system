"use client";

import { useEffect, useState } from "react";
import { MultiStepForm } from "@/components/MultiStepForm";
import { api } from "@/lib/axios";
import { Loan } from "@/types/loan";

export default function BorrowerDashboardPage() {
  const [loans, setLoans] = useState<Loan[]>([]);

  useEffect(() => {
    api
      .get("/borrower/dashboard")
      .then(({ data }) => setLoans(data.data.loans));
  }, []);

  return (
    <>
      <MultiStepForm active="Dashboard" />
      <h1 className="mb-4 text-2xl font-bold">Borrower Dashboard</h1>
      <div className="grid gap-4">
        {loans.map((loan) => (
          <div className="panel" key={loan._id}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <strong>{loan.status}</strong>
              <span>
                Rs. {loan.amount.toLocaleString("en-IN")} for {loan.tenureDays}{" "}
                days
              </span>
            </div>
            <p className="mt-2 text-sm text-zinc-600">
              Total repayment: Rs. {loan.totalRepayment.toLocaleString("en-IN")}{" "}
              | Paid: Rs. {loan.totalPaid.toLocaleString("en-IN")} |
              Outstanding: Rs. {loan.outstandingBalance.toLocaleString("en-IN")}
            </p>
            {loan.rejectionReason && (
              <p className="mt-2 text-sm font-semibold text-red-600">
                Rejected: {loan.rejectionReason}
              </p>
            )}
          </div>
        ))}
        {!loans.length && (
          <div className="panel text-sm text-zinc-600">
            No loan application yet.
          </div>
        )}
      </div>
    </>
  );
}
