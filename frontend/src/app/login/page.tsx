"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";
import { LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("borrower@lms.com");
  const [password, setPassword] = useState("Password@123");
  const [error, setError] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <main className="mx-auto grid min-h-[calc(100vh-57px)] max-w-md content-center px-4">
      <form onSubmit={submit} className="panel grid gap-4">
        <h1 className="text-2xl font-bold">Login</h1>
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
          <LogIn size={16} /> Login
        </button>
        <Link href="/signup" className="text-sm font-semibold text-mint">
          Create borrower account
        </Link>
      </form>
    </main>
  );
}
