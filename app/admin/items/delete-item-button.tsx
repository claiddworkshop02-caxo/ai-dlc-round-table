"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { deleteItem } from "@/lib/actions/items";

interface DeleteItemButtonProps {
  id: string;
  isLoaned: boolean;
}

export function DeleteItemButton({ id, isLoaned }: DeleteItemButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("この備品を削除しますか？")) return;

    startTransition(async () => {
      const result = await deleteItem(id);
      if (result.error) {
        alert(result.error);
      }
    });
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={isPending || isLoaned}
      title={isLoaned ? "貸出中の備品は削除できません" : "削除"}
    >
      削除
    </Button>
  );
}
