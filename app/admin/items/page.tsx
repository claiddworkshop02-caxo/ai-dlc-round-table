export const dynamic = "force-dynamic";

import Link from "next/link";
import { db } from "@/src/db";
import { items, loanRecords } from "@/src/schema";
import { eq, isNull, and, desc } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DeleteItemButton } from "./delete-item-button";

async function getItemsWithLoanStatus() {
  const allItems = await db
    .select()
    .from(items)
    .orderBy(desc(items.createdAt));

  const ongoingLoans = await db
    .select({ itemId: loanRecords.itemId })
    .from(loanRecords)
    .where(isNull(loanRecords.returnedAt));

  const loanedItemIds = new Set(ongoingLoans.map((l) => l.itemId));

  return allItems.map((item) => ({
    ...item,
    isLoaned: loanedItemIds.has(item.id),
  }));
}

export default async function AdminItemsPage() {
  const itemList = await getItemsWithLoanStatus();

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">備品一覧</h1>
        <Link
          href="/admin/items/new"
          className="inline-flex h-8 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
        >
          + 新規登録
        </Link>
      </div>

      {itemList.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          備品が登録されていません
        </p>
      ) : (
        <div className="rounded-xl ring-1 ring-foreground/10 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>備品名</TableHead>
                <TableHead>管理番号</TableHead>
                <TableHead>カテゴリ</TableHead>
                <TableHead>貸出状況</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {itemList.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.assetNumber ?? "-"}</TableCell>
                  <TableCell>{item.category ?? "-"}</TableCell>
                  <TableCell>
                    {item.isLoaned ? (
                      <Badge variant="warning">貸出中</Badge>
                    ) : (
                      <Badge variant="success">利用可</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/items/${item.id}/edit`}
                        className="inline-flex h-7 items-center justify-center rounded-[min(var(--radius-md),12px)] border border-border bg-background px-2.5 text-[0.8rem] font-medium text-foreground transition-colors hover:bg-muted"
                      >
                        編集
                      </Link>
                      <Link
                        href={`/admin/items/${item.id}/qr`}
                        className="inline-flex h-7 items-center justify-center rounded-[min(var(--radius-md),12px)] border border-border bg-background px-2.5 text-[0.8rem] font-medium text-foreground transition-colors hover:bg-muted"
                      >
                        QR
                      </Link>
                      <DeleteItemButton
                        id={item.id}
                        isLoaned={item.isLoaned}
                      />
                    </div>
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
