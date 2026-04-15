import Link from "next/link";
import { db } from "@/src/db";
import { items, loanRecords } from "@/src/schema";
import { eq, isNull, and } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoanForm, ReturnButton } from "./loan-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ScanItemPage({ params }: PageProps) {
  const { id } = await params;

  // 備品情報を取得
  const itemResult = await db
    .select()
    .from(items)
    .where(eq(items.id, id));

  if (itemResult.length === 0) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center bg-muted/40 px-4 py-8">
        <Card className="w-full max-w-sm">
          <CardContent className="py-8 text-center">
            <p className="text-lg font-medium text-destructive">
              備品が見つかりません
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              QRコードが正しいか確認してください
            </p>
            <Link href="/" className="mt-4 inline-block">
              <Button variant="outline" className="mt-2">
                トップページへ
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const item = itemResult[0];

  // 現在の貸出状況を取得
  const ongoingLoan = await db
    .select()
    .from(loanRecords)
    .where(and(eq(loanRecords.itemId, id), isNull(loanRecords.returnedAt)));

  const currentLoan = ongoingLoan[0] ?? null;
  const isLoaned = currentLoan !== null;

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted/40 px-4 py-8">
      <div className="w-full max-w-sm space-y-4">
        {/* 備品情報 */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-xl leading-tight">{item.name}</CardTitle>
              {isLoaned ? (
                <Badge variant="warning" className="shrink-0">貸出中</Badge>
              ) : (
                <Badge variant="success" className="shrink-0">利用可</Badge>
              )}
            </div>
            {item.category && (
              <p className="text-sm text-muted-foreground">{item.category}</p>
            )}
            {item.assetNumber && (
              <p className="text-xs text-muted-foreground">
                管理番号: {item.assetNumber}
              </p>
            )}
          </CardHeader>
          <CardContent>
            {isLoaned ? (
              <ReturnButton
                loanRecordId={currentLoan.id}
                itemName={item.name}
                borrowerName={currentLoan.borrowerName}
              />
            ) : (
              <LoanForm itemId={id} itemName={item.name} />
            )}
          </CardContent>
        </Card>

        {/* 戻るリンク */}
        <div className="text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:underline">
            トップページへ戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
