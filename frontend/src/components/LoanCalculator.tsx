"use client";

import { useMemo, useState } from "react";
import { IndianRupee, Send } from "lucide-react";
import { api } from "@/lib/axios";

export function LoanCalculator() {
  const [amount, setAmount] = useState(50000);
  const [tenureDays, setTenureDays] = useState(30);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const calc = useMemo(() => {
    const interestAmount = Number(
      ((amount * 12 * tenureDays) / (365 * 100)).toFixed(2),
    );
    return {
      interestAmount,
      totalRepayment: Number((amount + interestAmount).toFixed(2)),
    };
  }, [amount, tenureDays]);

  const apply = async () => {
    setError("");
    setMessage("");
    try {
      await api.post("/loans", { amount, tenureDays });
      setMessage("Loan application submitted with APPLIED status.");
    } catch (err: any) {
      const data = err.response?.data;
      setError(
        data?.errors?.join?.(" ") ||
          data?.message ||
          "Loan application failed.",
      );
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
      <div className="panel grid gap-5">
        <label className="grid gap-2 text-sm font-semibold">
          Loan Amount: Rs. {amount.toLocaleString("en-IN")}
          <input
            type="range"
            min={50000}
            max={500000}
            step={5000}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Tenure: {tenureDays} days
          <input
            type="range"
            min={30}
            max={365}
            step={5}
            value={tenureDays}
            onChange={(e) => setTenureDays(Number(e.target.value))}
          />
        </label>
        {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
        {message && (
          <p className="text-sm font-semibold text-green-700">{message}</p>
        )}
        <button className="btn" onClick={apply}>
          <Send size={16} /> Apply
        </button>
      </div>
      <div className="panel grid gap-3">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <IndianRupee size={18} /> Live Calculation
        </h2>
        <p className="text-sm text-zinc-600">
          Interest is fixed at 12% p.a. using simple interest.
        </p>
        <div className="grid gap-2 text-sm">
          <div className="flex justify-between">
            <span>Principal</span>
            <strong>Rs. {amount.toLocaleString("en-IN")}</strong>
          </div>
          <div className="flex justify-between">
            <span>Interest</span>
            <strong>Rs. {calc.interestAmount.toLocaleString("en-IN")}</strong>
          </div>
          <div className="flex justify-between border-t pt-2 text-base">
            <span>Total repayment</span>
            <strong>Rs. {calc.totalRepayment.toLocaleString("en-IN")}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
