"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    });
  }

  return (
    <div className="min-h-full flex flex-col">
      <header className="flex items-center justify-between border-b bg-background px-6 py-3">
        <span className="font-semibold">備品管理システム - 管理者エリア</span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          disabled={isPending}
        >
          ログアウト
        </Button>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
