import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <h1 className="text-2xl font-bold mb-8">管理者ダッシュボード</h1>
      <div className="w-full max-w-md space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>備品管理</CardTitle>
            <CardDescription>
              備品の登録・編集・削除、QRコードの発行ができます
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/admin/items"
              className="inline-flex w-full h-8 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
            >
              備品一覧を見る
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>貸出履歴</CardTitle>
            <CardDescription>
              全備品の貸出・返却履歴を確認できます
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/admin/loans"
              className="inline-flex w-full h-8 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
            >
              貸出履歴を見る
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
