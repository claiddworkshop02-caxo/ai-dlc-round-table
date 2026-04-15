export const dynamic = "force-dynamic";

import { db } from "@/src/db";
import { items, loanRecords } from "@/src/schema";
import { eq, desc } from "drizzle-orm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

async function getAllLoans() {
  const loans = await db
    .select({
      id: loanRecords.id,
      borrowerName: loanRecords.borrowerName,
      loanedAt: loanRecords.loanedAt,
      returnedAt: loanRecords.returnedAt,
      itemName: items.name,
      itemCategory: items.category,
    })
    .from(loanRecords)
    .innerJoin(items, eq(loanRecords.itemId, items.id))
    .orderBy(desc(loanRecords.loanedAt));

  return loans;
}

function formatDate(date: Date | null): string {
  if (!date) return "-";
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function AdminLoansPage() {
  const loans = await getAllLoans();

  const ongoingCount = loans.filter((l) => !l.returnedAt).length;

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">貸出履歴</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            現在 {ongoingCount} 件の貸出中
          </p>
        </div>
      </div>

      {loans.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground">
          貸出履歴がありません
        </p>
      ) : (
        <div className="rounded-xl ring-1 ring-foreground/10 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>備品名</TableHead>
                <TableHead>借りた人</TableHead>
                <TableHead>貸出日時</TableHead>
                <TableHead>返却日時</TableHead>
                <TableHead>状態</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loans.map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell className="font-medium">{loan.itemName}</TableCell>
                  <TableCell>{loan.borrowerName}</TableCell>
                  <TableCell className="text-sm">
                    {formatDate(loan.loanedAt)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDate(loan.returnedAt)}
                  </TableCell>
                  <TableCell>
                    {loan.returnedAt ? (
                      <Badge variant="secondary">返却済</Badge>
                    ) : (
                      <Badge variant="warning">貸出中</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
