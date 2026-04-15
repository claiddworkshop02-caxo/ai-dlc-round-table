"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loanItem, returnItem } from "@/lib/actions/loans";

interface LoanFormProps {
  itemId: string;
  itemName: string;
}

export function LoanForm({ itemId, itemName }: LoanFormProps) {
  const [borrowerName, setBorrowerName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await loanItem(itemId, borrowerName);
      if (result.error) {
        setError(result.error);
      } else {
        setDone(true);
      }
    });
  }

  if (done) {
    return (
      <div className="rounded-xl bg-green-50 p-6 text-center">
        <p className="text-2xl font-bold text-green-700">貸出しました</p>
        <p className="mt-2 text-green-600">
          {itemName} を {borrowerName} さんに貸出しました
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="borrowerName" className="text-base font-medium">
          お名前
        </Label>
        <Input
          id="borrowerName"
          type="text"
          placeholder="山田 太郎"
          value={borrowerName}
          onChange={(e) => setBorrowerName(e.target.value)}
          className="h-12 text-base"
          required
          disabled={isPending}
        />
      </div>
      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
          {error}
        </p>
      )}
      <Button
        type="submit"
        size="lg"
        className="h-14 text-base font-bold"
        disabled={isPending || !borrowerName.trim()}
      >
        {isPending ? "処理中..." : "貸出する"}
      </Button>
    </form>
  );
}

interface ReturnButtonProps {
  loanRecordId: string;
  itemName: string;
  borrowerName: string;
}

export function ReturnButton({
  loanRecordId,
  itemName,
  borrowerName,
}: ReturnButtonProps) {
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleReturn() {
    setError(null);
    startTransition(async () => {
      const result = await returnItem(loanRecordId);
      if (result.error) {
        setError(result.error);
      } else {
        setDone(true);
      }
    });
  }

  if (done) {
    return (
      <div className="rounded-xl bg-blue-50 p-6 text-center">
        <p className="text-2xl font-bold text-blue-700">返却しました</p>
        <p className="mt-2 text-blue-600">
          {itemName} が返却されました
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl bg-amber-50 p-4">
        <p className="text-sm text-amber-700 font-medium">現在の貸出情報</p>
        <p className="mt-1 text-amber-900">借りている人: {borrowerName}</p>
      </div>
      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
          {error}
        </p>
      )}
      <Button
        onClick={handleReturn}
        size="lg"
        variant="outline"
        className="h-14 text-base font-bold border-2"
        disabled={isPending}
      >
        {isPending ? "処理中..." : "返却する"}
      </Button>
    </div>
  );
}
