"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";
import { UserPlus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function SignupPage() {
  const { signup } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      await signup(fullName, email, password);
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <main className="mx-auto grid min-h-[calc(100vh-57px)] max-w-md content-center px-4">
      <form onSubmit={submit} className="panel grid gap-4">
        <h1 className="text-2xl font-bold">Borrower Signup</h1>
        <input
          className="input"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Full name"
        />
        <input
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          className="input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
        <button className="btn" type="submit">
          <UserPlus size={16} /> Sign Up
        </button>
        <Link href="/login" className="text-sm font-semibold text-mint">
          Already have an account?
        </Link>
      </form>
    </main>
  );
}
