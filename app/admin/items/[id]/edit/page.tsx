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
} from "@/components/ui/card";
import { ItemForm } from "../../item-form";

interface EditItemPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditItemPage({ params }: EditItemPageProps) {
  const { id } = await params;

  const [item] = await db.select().from(items).where(eq(items.id, id));
  if (!item) notFound();

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="mb-4">
        <Link
          href="/admin/items"
          className="inline-flex h-7 items-center justify-center rounded-[min(var(--radius-md),12px)] border border-border bg-background px-2.5 text-[0.8rem] font-medium text-foreground transition-colors hover:bg-muted"
        >
          ← 一覧に戻る
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>備品 編集</CardTitle>
        </CardHeader>
        <CardContent>
          <ItemForm
            defaultValues={{
              id: item.id,
              name: item.name,
              assetNumber: item.assetNumber,
              category: item.category,
              description: item.description,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
