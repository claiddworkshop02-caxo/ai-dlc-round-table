import Link from "next/link";
import { db } from "@/src/db";
import { items, loanRecords } from "@/src/schema";
import { eq, isNull, desc } from "drizzle-orm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

async function getCurrentLoans() {
  const loans = await db
    .select({
      id: loanRecords.id,
      borrowerName: loanRecords.borrowerName,
      loanedAt: loanRecords.loanedAt,
      itemName: items.name,
      itemCategory: items.category,
    })
    .from(loanRecords)
    .innerJoin(items, eq(loanRecords.itemId, items.id))
    .where(isNull(loanRecords.returnedAt))
    .orderBy(desc(loanRecords.loanedAt));

  return loans;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("ja-JP", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function HomePage() {
  const currentLoans = await getCurrentLoans();

  return (
    <div className="flex min-h-svh flex-col bg-muted/40">
      {/* ヘッダー */}
      <header className="border-b bg-background px-6 py-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <h1 className="text-lg font-bold">備品管理システム</h1>
          <Link href="/admin">
            <Button variant="outline" size="sm">
              管理者ログイン
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 space-y-6">
        {/* QRスキャンボタン */}
        <Card>
          <CardContent className="pt-6 pb-6 text-center">
            <p className="mb-4 text-muted-foreground">
              備品を借りる・返却するにはQRコードをスキャンしてください
            </p>
            <Link href="/scan">
              <Button size="lg" className="h-14 px-8 text-base font-bold">
                QRコードをスキャンする
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* 現在の貸出状況 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              現在の貸出状況
              {currentLoans.length > 0 && (
                <Badge variant="warning">{currentLoans.length} 件貸出中</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentLoans.length === 0 ? (
              <p className="py-4 text-center text-muted-foreground">
                現在貸出中の備品はありません
              </p>
            ) : (
              <div className="rounded-xl ring-1 ring-foreground/10 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>備品名</TableHead>
                      <TableHead>借りている人</TableHead>
                      <TableHead>貸出日時</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentLoans.map((loan) => (
                      <TableRow key={loan.id}>
                        <TableCell className="font-medium">
                          {loan.itemName}
                        </TableCell>
                        <TableCell>{loan.borrowerName}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(loan.loanedAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
