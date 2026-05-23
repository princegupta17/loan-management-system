"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/types/user";
import { ROLE_HOME } from "@/utils/constants";

export function RoleGuard({
  roles,
  children,
}: {
  roles: UserRole[];
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (
      !loading &&
      user &&
      user.role !== "ADMIN" &&
      !roles.includes(user.role)
    ) {
      router.push(ROLE_HOME[user.role]);
    }
  }, [loading, user, roles, router]);

  if (loading || !user) return null;
  if (user.role !== "ADMIN" && !roles.includes(user.role)) return null;
  return <>{children}</>;
}
