"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { RoleGuard } from "@/components/RoleGuard";
import { api } from "@/lib/axios";
import { User } from "@/types/user";

export default function SalesPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    api
      .get("/dashboard/sales/leads")
      .then(({ data }) => setUsers(data.data.users));
  }, []);

  return (
    <RoleGuard roles={["SALES"]}>
      <h1 className="mb-5 flex items-center gap-2 text-2xl font-bold">
        <Users size={22} /> Sales Leads
      </h1>
      <div className="grid gap-3">
        {users.map((user) => (
          <div className="panel" key={user._id || user.id}>
            <div className="flex flex-wrap justify-between gap-3">
              <strong>{user.fullName}</strong>
              <span className="text-sm text-zinc-600">{user.email}</span>
            </div>
            <p className="mt-2 text-sm text-zinc-600">
              Personal details:{" "}
              {user.personalDetailsCompleted ? "Completed" : "Pending"} |
              Documents: {user.documentsUploaded ? "Uploaded" : "Pending"}
            </p>
          </div>
        ))}
        {!users.length && (
          <div className="panel text-sm text-zinc-600">
            No registered borrowers without applications.
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
