"use client";

import { useEffect, useState } from "react";
import { Check, ShieldCheck, X } from "lucide-react";
import { RoleGuard } from "@/components/RoleGuard";
import { api } from "@/lib/axios";
import { Loan } from "@/types/loan";
import { User } from "@/types/user";

export default function SanctionPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [reason, setReason] = useState<Record<string, string>>({});

  const load = () =>
    api
      .get("/dashboard/sanction/loans")
      .then(({ data }) => setLoans(data.data.loans));
  useEffect(() => {
    load();
  }, []);

  const approve = async (id: string) => {
    await api.patch(`/dashboard/sanction/${id}/approve`);
    load();
  };

  const reject = async (id: string) => {
    await api.patch(`/dashboard/sanction/${id}/reject`, {
      reason: reason[id] || "Rejected by sanction team",
    });
    load();
  };

  return (
    <RoleGuard roles={["SANCTION"]}>
      <h1 className="mb-5 flex items-center gap-2 text-2xl font-bold">
        <ShieldCheck size={22} /> Sanction Queue
      </h1>
      <div className="grid gap-4">
        {loans.map((loan) => {
          const borrower = loan.borrower as User;
          return (
            <div className="panel grid gap-3" key={loan._id}>
              <div className="flex flex-wrap justify-between gap-3">
                <strong>{borrower.fullName}</strong>
                <span>
                  Rs. {loan.totalRepayment.toLocaleString("en-IN")} repayment
                </span>
              </div>
              <p className="text-sm text-zinc-600">
                PAN: {borrower.pan} | Salary: Rs.{" "}
                {borrower.monthlySalary?.toLocaleString("en-IN")} |{" "}
                {loan.tenureDays} days
              </p>
              <input
                className="input"
                placeholder="Rejection reason"
                value={reason[loan._id] || ""}
                onChange={(e) =>
                  setReason({ ...reason, [loan._id]: e.target.value })
                }
              />
              <div className="flex gap-2">
                <button className="btn" onClick={() => approve(loan._id)}>
                  <Check size={16} /> Approve
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => reject(loan._id)}
                >
                  <X size={16} /> Reject
                </button>
              </div>
            </div>
          );
        })}
        {!loans.length && (
          <div className="panel text-sm text-zinc-600">
            No APPLIED loans awaiting sanction.
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
