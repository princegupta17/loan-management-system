"use client";

import { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";
import { RoleGuard } from "@/components/RoleGuard";
import { api } from "@/lib/axios";

export default function AdminPage() {
  const [summary, setSummary] = useState<Record<string, number>>({});

  useEffect(() => {
    api
      .get("/dashboard/admin/summary")
      .then(({ data }) => setSummary(data.data));
  }, []);

  return (
    <RoleGuard roles={["ADMIN"]}>
      <h1 className="mb-5 flex items-center gap-2 text-2xl font-bold">
        <BarChart3 size={22} /> Admin Overview
      </h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(summary).map(([key, value]) => (
          <div key={key} className="panel">
            <p className="text-sm font-semibold capitalize text-zinc-600">
              {key}
            </p>
            <p className="mt-2 text-3xl font-bold">{value}</p>
          </div>
        ))}
      </div>
    </RoleGuard>
  );
}
