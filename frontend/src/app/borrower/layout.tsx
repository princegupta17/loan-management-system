import { ProtectedRoute } from "@/components/ProtectedRoute";
import { RoleGuard } from "@/components/RoleGuard";

export default function BorrowerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <RoleGuard roles={["BORROWER"]}>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      </RoleGuard>
    </ProtectedRoute>
  );
}
