import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Sidebar } from "@/components/Sidebar";

export default function OpsLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="md:flex">
        <Sidebar />
        <main className="min-w-0 flex-1 px-4 py-8">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
