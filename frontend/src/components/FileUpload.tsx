"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Upload } from "lucide-react";
import { api } from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";

export function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { refreshUser } = useAuth();

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!file) {
      setError("Choose a PDF, JPG or PNG salary slip.");
      return;
    }
    const form = new FormData();
    form.append("salarySlip", file);
    try {
      await api.post("/borrower/salary-slip", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await refreshUser();
      setMessage("Salary slip uploaded successfully.");
    } catch (err: any) {
      setError(err.response?.data?.message || "Upload failed.");
    }
  };

  return (
    <form onSubmit={submit} className="panel grid gap-4">
      <input
        className="input"
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
      {message && (
        <p className="text-sm font-semibold text-green-700">{message}</p>
      )}
      <button className="btn" type="submit">
        <Upload size={16} /> Upload Salary Slip
      </button>
    </form>
  );
}
