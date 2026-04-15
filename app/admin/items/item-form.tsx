"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createItem, updateItem } from "@/lib/actions/items";

interface ItemFormProps {
  defaultValues?: {
    id: string;
    name: string;
    assetNumber: string | null;
    category: string | null;
    description: string | null;
  };
}

export function ItemForm({ defaultValues }: ItemFormProps) {
  const [isPending, startTransition] = useTransition();
  const isEdit = !!defaultValues;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      try {
        if (isEdit && defaultValues) {
          await updateItem(defaultValues.id, formData);
        } else {
          await createItem(formData);
        }
      } catch (err) {
        const error = err as Error & { digest?: string };
        // NEXT_REDIRECT は redirect() の正常な動作
        if (
          error?.digest?.startsWith("NEXT_REDIRECT") ||
          error?.message?.includes("NEXT_REDIRECT")
        ) {
          return;
        }
        alert(error?.message ?? "エラーが発生しました");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">
          備品名 <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          name="name"
          placeholder="例: MacBook Pro 14インチ"
          defaultValue={defaultValues?.name ?? ""}
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="assetNumber">管理番号（任意）</Label>
        <Input
          id="assetNumber"
          name="assetNumber"
          placeholder="例: PC-001"
          defaultValue={defaultValues?.assetNumber ?? ""}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="category">カテゴリ（任意）</Label>
        <Input
          id="category"
          name="category"
          placeholder="例: パソコン"
          defaultValue={defaultValues?.category ?? ""}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">説明（任意）</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="備品の詳細・注意事項など"
          defaultValue={defaultValues?.description ?? ""}
          rows={3}
        />
      </div>

      <div className="pt-2">
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "保存中..." : isEdit ? "更新する" : "登録する"}
        </Button>
      </div>
    </form>
  );
}
