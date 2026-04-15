"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { loanItem, returnItem } from "@/lib/actions/loans";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export interface ItemWithLoan {
  id: string;
  name: string;
  assetNumber: string | null;
  category: string | null;
  isLoaned: boolean;
  currentLoanId: string | null;
  currentBorrower: string | null;
}

export function ItemsList({ items }: { items: ItemWithLoan[] }) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [borrowerName, setBorrowerName] = useState("");
  const [isPending, startTransition] = useTransition();
  const [flash, setFlash] = useState<{ id: string; type: "success" | "error"; text: string } | null>(null);

  function selectItem(id: string) {
    setSelectedId((prev) => (prev === id ? null : id));
    setBorrowerName("");
    setFlash(null);
  }

  function handleBorrow(itemId: string) {
    startTransition(async () => {
      const result = await loanItem(itemId, borrowerName);
      if (result.error) {
        setFlash({ id: itemId, type: "error", text: result.error });
      } else {
        setFlash({ id: itemId, type: "success", text: "貸出しました" });
        setSelectedId(null);
        setBorrowerName("");
        router.refresh();
      }
    });
  }

  function handleReturn(itemId: string, loanId: string) {
    startTransition(async () => {
      const result = await returnItem(loanId);
      if (result.error) {
        setFlash({ id: itemId, type: "error", text: result.error });
      } else {
        setFlash({ id: itemId, type: "success", text: "返却しました" });
        setSelectedId(null);
        router.refresh();
      }
    });
  }

  if (items.length === 0) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        備品が登録されていません
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const isSelected = selectedId === item.id;
        const itemFlash = flash?.id === item.id ? flash : null;

        return (
          <Card key={item.id} className={isSelected ? "ring-2 ring-primary" : ""}>
            <CardContent className="p-4">
              {/* 備品情報 */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold truncate">{item.name}</p>
                  <div className="mt-0.5 flex flex-wrap gap-x-3 text-xs text-muted-foreground">
                    {item.category && <span>{item.category}</span>}
                    {item.assetNumber && <span>No. {item.assetNumber}</span>}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {item.isLoaned ? (
                    <Badge variant="warning">貸出中</Badge>
                  ) : (
                    <Badge variant="success">利用可</Badge>
                  )}
                  <Button
                    size="sm"
                    variant={isSelected ? "secondary" : item.isLoaned ? "outline" : "default"}
                    onClick={() => selectItem(item.id)}
                    disabled={isPending}
                  >
                    {isSelected
                      ? "閉じる"
                      : item.isLoaned
                      ? "返却する"
                      : "借りる"}
                  </Button>
                </div>
              </div>

              {/* フラッシュメッセージ */}
              {itemFlash && (
                <p
                  className={`mt-3 rounded-lg px-3 py-2 text-sm font-medium ${
                    itemFlash.type === "success"
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {itemFlash.text}
                </p>
              )}

              {/* 展開フォーム */}
              {isSelected && (
                <div className="mt-4 border-t pt-4">
                  {item.isLoaned ? (
                    /* 返却フォーム */
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        現在の借り手:{" "}
                        <span className="font-medium text-foreground">
                          {item.currentBorrower}
                        </span>
                      </p>
                      <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => handleReturn(item.id, item.currentLoanId!)}
                        disabled={isPending}
                      >
                        {isPending ? "処理中..." : "返却を確定する"}
                      </Button>
                    </div>
                  ) : (
                    /* 貸出フォーム */
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <Label htmlFor={`name-${item.id}`}>お名前</Label>
                        <Input
                          id={`name-${item.id}`}
                          placeholder="山田 太郎"
                          value={borrowerName}
                          onChange={(e) => setBorrowerName(e.target.value)}
                          disabled={isPending}
                          autoFocus
                        />
                      </div>
                      <Button
                        className="w-full"
                        onClick={() => handleBorrow(item.id)}
                        disabled={isPending || !borrowerName.trim()}
                      >
                        {isPending ? "処理中..." : "貸出を確定する"}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
