export const dynamic = "force-dynamic";

import { db } from "@/src/db";
import { items, loanRecords } from "@/src/schema";
import { isNull, eq } from "drizzle-orm";
import { ItemsList } from "./items-list";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function getItemsWithLoanStatus() {
  const allItems = await db.select().from(items);

  const ongoingLoans = await db
    .select({
      itemId: loanRecords.itemId,
      loanId: loanRecords.id,
      borrowerName: loanRecords.borrowerName,
    })
    .from(loanRecords)
    .where(isNull(loanRecords.returnedAt));

  const loanMap = new Map(
    ongoingLoans.map((l) => [l.itemId, { loanId: l.loanId, borrowerName: l.borrowerName }])
  );

  return allItems.map((item) => {
    const loan = loanMap.get(item.id);
    return {
      id: item.id,
      name: item.name,
      assetNumber: item.assetNumber,
      category: item.category,
      isLoaned: !!loan,
      currentLoanId: loan?.loanId ?? null,
      currentBorrower: loan?.borrowerName ?? null,
    };
  });
}

export default async function ItemsPage() {
  const itemList = await getItemsWithLoanStatus();

  return (
    <div className="flex min-h-svh flex-col bg-muted/40">
      <header className="border-b bg-background px-4 py-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-muted-foreground hover:underline">
              ← 戻る
            </Link>
            <h1 className="text-lg font-bold">備品一覧</h1>
          </div>
          <span className="text-sm text-muted-foreground">
            {itemList.length} 件
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
        <ItemsList items={itemList} />
      </main>
    </div>
  );
}
