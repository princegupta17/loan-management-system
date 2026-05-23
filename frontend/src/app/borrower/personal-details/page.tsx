"use client";

import { FormEvent, useState } from "react";
import { Save } from "lucide-react";
import { MultiStepForm } from "@/components/MultiStepForm";
import { api } from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";

export default function PersonalDetailsPage() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    pan: "",
    dob: "",
    monthlySalary: "",
    employmentMode: "Salaried",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      await api.post("/borrower/personal-details", {
        ...form,
        monthlySalary: Number(form.monthlySalary),
      });
      await refreshUser();
      setMessage("BRE passed. Personal details saved.");
    } catch (err: any) {
      const data = err.response?.data;
      setError(
        data?.errors?.map?.((item: any) => item.msg || item).join(" ") ||
          data?.message ||
          "Could not save details.",
      );
    }
  };

  return (
    <>
      <MultiStepForm active="Personal Details" />
      <form className="panel grid gap-4" onSubmit={submit}>
        <h1 className="text-2xl font-bold">Personal Details</h1>
        <input
          className="input"
          placeholder="Full Name"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        />
        <input
          className="input"
          placeholder="PAN e.g. ABCDE1234F"
          value={form.pan}
          onChange={(e) =>
            setForm({ ...form, pan: e.target.value.toUpperCase() })
          }
        />
        <input
          className="input"
          type="date"
          value={form.dob}
          onChange={(e) => setForm({ ...form, dob: e.target.value })}
        />
        <input
          className="input"
          type="number"
          placeholder="Monthly Salary"
          value={form.monthlySalary}
          onChange={(e) => setForm({ ...form, monthlySalary: e.target.value })}
        />
        <select
          className="input"
          value={form.employmentMode}
          onChange={(e) => setForm({ ...form, employmentMode: e.target.value })}
        >
          <option>Salaried</option>
          <option>Self-Employed</option>
          <option>Unemployed</option>
        </select>
        {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
        {message && (
          <p className="text-sm font-semibold text-green-700">{message}</p>
        )}
        <button className="btn" type="submit">
          <Save size={16} /> Save and Run BRE
        </button>
      </form>
    </>
  );
}
