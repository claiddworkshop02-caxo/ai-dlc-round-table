"use server";

import { db } from "@/src/db";
import { items, loanRecords } from "@/src/schema";
import { eq, isNull, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function loanItem(
  itemId: string,
  borrowerName: string
): Promise<{ error?: string }> {
  const trimmedName = borrowerName.trim();
  if (!trimmedName) {
    return { error: "お名前を入力してください" };
  }

  // 二重貸出チェック
  const ongoingLoans = await db
    .select({ id: loanRecords.id })
    .from(loanRecords)
    .where(and(eq(loanRecords.itemId, itemId), isNull(loanRecords.returnedAt)));

  if (ongoingLoans.length > 0) {
    return { error: "この備品はすでに貸出中です" };
  }

  // 備品の存在確認
  const item = await db
    .select({ id: items.id })
    .from(items)
    .where(eq(items.id, itemId));

  if (item.length === 0) {
    return { error: "備品が見つかりません" };
  }

  await db.insert(loanRecords).values({
    itemId,
    borrowerName: trimmedName,
  });

  revalidatePath("/");
  revalidatePath(`/scan/${itemId}`);
  revalidatePath("/admin/loans");

  return {};
}

export async function returnItem(
  loanRecordId: string
): Promise<{ error?: string }> {
  const loan = await db
    .select({ id: loanRecords.id, itemId: loanRecords.itemId })
    .from(loanRecords)
    .where(eq(loanRecords.id, loanRecordId));

  if (loan.length === 0) {
    return { error: "貸出記録が見つかりません" };
  }

  await db
    .update(loanRecords)
    .set({ returnedAt: new Date() })
    .where(eq(loanRecords.id, loanRecordId));

  revalidatePath("/");
  revalidatePath(`/scan/${loan[0].itemId}`);
  revalidatePath("/admin/loans");

  return {};
}
