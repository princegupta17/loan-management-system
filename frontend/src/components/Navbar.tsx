"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function Navbar() {
  const { user, loading, logout } = useAuth();

  if (loading) return null;

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold text-ink">
          Loan Management System
        </Link>
        {user && (
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-zinc-600 sm:inline">
              {user.fullName}
            </span>
            <span className="rounded-md bg-zinc-100 px-2 py-1 font-semibold">
              {user.role}
            </span>
            <button
              className="btn-secondary px-3"
              onClick={logout}
              aria-label="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
