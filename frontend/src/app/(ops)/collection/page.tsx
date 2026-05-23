"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { ReceiptText } from "lucide-react";
import { RoleGuard } from "@/components/RoleGuard";
import { api } from "@/lib/axios";
import { Loan } from "@/types/loan";
import { User } from "@/types/user";

export default function CollectionPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [forms, setForms] = useState<
    Record<string, { utr: string; amount: string; date: string }>
  >({});
  const [message, setMessage] = useState("");

  const load = () =>
    api
      .get("/dashboard/collection/loans")
      .then(({ data }) => setLoans(data.data.loans));
  useEffect(() => {
    load();
  }, []);

  const submit = async (event: FormEvent, loanId: string) => {
    event.preventDefault();
    setMessage("");
    const form = forms[loanId];
    try {
      await api.post("/payments", {
        loanId,
        utr: form?.utr,
        amount: Number(form?.amount),
        date: form?.date,
      });
      setMessage("Payment recorded successfully.");
      setForms({ ...forms, [loanId]: { utr: "", amount: "", date: "" } });
      load();
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Payment failed.");
    }
  };

  return (
    <RoleGuard roles={["COLLECTION"]}>
      <h1 className="mb-5 flex items-center gap-2 text-2xl font-bold">
        <ReceiptText size={22} /> Collection
      </h1>
      {message && (
        <p className="mb-4 rounded-md bg-amber/20 px-3 py-2 text-sm font-semibold">
          {message}
        </p>
      )}
      <div className="grid gap-4">
        {loans.map((loan) => {
          const borrower = loan.borrower as User;
          const form = forms[loan._id] || { utr: "", amount: "", date: "" };
          return (
            <form
              className="panel grid gap-3"
              key={loan._id}
              onSubmit={(event) => submit(event, loan._id)}
            >
              <div className="flex flex-wrap justify-between gap-3">
                <strong>{borrower.fullName}</strong>
                <span>
                  Outstanding Rs.{" "}
                  {loan.outstandingBalance.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <input
                  className="input"
                  placeholder="UTR"
                  value={form.utr}
                  onChange={(e) =>
                    setForms({
                      ...forms,
                      [loan._id]: { ...form, utr: e.target.value },
                    })
                  }
                />
                <input
                  className="input"
                  type="number"
                  placeholder="Amount"
                  value={form.amount}
                  onChange={(e) =>
                    setForms({
                      ...forms,
                      [loan._id]: { ...form, amount: e.target.value },
                    })
                  }
                />
                <input
                  className="input"
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForms({
                      ...forms,
                      [loan._id]: { ...form, date: e.target.value },
                    })
                  }
                />
              </div>
              <button className="btn" type="submit">
                Record Payment
              </button>
            </form>
          );
        })}
        {!loans.length && (
          <div className="panel text-sm text-zinc-600">
            No DISBURSED loans awaiting collection.
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
