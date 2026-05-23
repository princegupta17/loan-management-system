"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { modules } from "@/utils/constants";
import { useAuth } from "@/hooks/useAuth";

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  if (!user) return null;

  const visible = modules.filter((item) =>
    item.roles.includes(user.role as never),
  );

  return (
    <aside className="border-r border-zinc-200 bg-white p-4 md:min-h-[calc(100vh-57px)] md:w-64">
      <nav className="grid gap-2">
        {visible.map((item) => (
          <Link
            href={item.href}
            key={item.href}
            className={`rounded-md px-3 py-2 text-sm font-semibold ${pathname.startsWith(item.href) ? "bg-ink text-white" : "text-zinc-700 hover:bg-zinc-100"}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
