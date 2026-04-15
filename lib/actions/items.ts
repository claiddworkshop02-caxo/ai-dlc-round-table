"use server";

import { db } from "@/src/db";
import { items, loanRecords } from "@/src/schema";
import { eq, isNull, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createItem(formData: FormData): Promise<void> {
  const name = (formData.get("name") as string | null)?.trim();
  if (!name) {
    throw new Error("備品名は必須です");
  }

  const assetNumber =
    (formData.get("assetNumber") as string | null)?.trim() || null;
  const category =
    (formData.get("category") as string | null)?.trim() || null;
  const description =
    (formData.get("description") as string | null)?.trim() || null;

  await db.insert(items).values({
    name,
    assetNumber,
    category,
    description,
  });

  redirect("/admin/items");
}

export async function updateItem(
  id: string,
  formData: FormData
): Promise<void> {
  const name = (formData.get("name") as string | null)?.trim();
  if (!name) {
    throw new Error("備品名は必須です");
  }

  const assetNumber =
    (formData.get("assetNumber") as string | null)?.trim() || null;
  const category =
    (formData.get("category") as string | null)?.trim() || null;
  const description =
    (formData.get("description") as string | null)?.trim() || null;

  await db
    .update(items)
    .set({ name, assetNumber, category, description })
    .where(eq(items.id, id));

  redirect("/admin/items");
}

export async function deleteItem(id: string): Promise<{ error?: string }> {
  // 貸出中チェック（returned_at IS NULL のレコードが存在するか）
  const ongoingLoans = await db
    .select({ id: loanRecords.id })
    .from(loanRecords)
    .where(and(eq(loanRecords.itemId, id), isNull(loanRecords.returnedAt)));

  if (ongoingLoans.length > 0) {
    return { error: "貸出中の備品は削除できません" };
  }

  await db.delete(items).where(eq(items.id, id));
  revalidatePath("/admin/items");
  return {};
}
