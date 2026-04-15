import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ItemForm } from "../item-form";

export default function NewItemPage() {
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
          <CardTitle>備品 新規登録</CardTitle>
        </CardHeader>
        <CardContent>
          <ItemForm />
        </CardContent>
      </Card>
    </div>
  );
}
