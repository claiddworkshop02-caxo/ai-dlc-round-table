import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/src/db";
import { items } from "@/src/schema";
import { eq } from "drizzle-orm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { QrDisplay } from "./qr-display";

interface QrPageProps {
  params: Promise<{ id: string }>;
}

export default async function QrPage({ params }: QrPageProps) {
  const { id } = await params;

  const [item] = await db.select().from(items).where(eq(items.id, id));
  if (!item) notFound();

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const qrUrl = `${appUrl}/scan/${item.id}`;

  return (
    <div className="p-6 max-w-sm mx-auto">
      <div className="mb-4 print:hidden">
        <Link
          href="/admin/items"
          className="inline-flex h-7 items-center justify-center rounded-[min(var(--radius-md),12px)] border border-border bg-background px-2.5 text-[0.8rem] font-medium text-foreground transition-colors hover:bg-muted"
        >
          ← 一覧に戻る
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>QRコード</CardTitle>
          <CardDescription>{item.name}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <QrDisplay url={qrUrl} itemName={item.name} />
        </CardContent>
      </Card>
    </div>
  );
}
