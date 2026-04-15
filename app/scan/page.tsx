import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrScanner } from "./qr-scanner";

export default function ScanPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted/40 px-4 py-8">
      <div className="w-full max-w-sm space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-center">QRコードをスキャン</CardTitle>
            <p className="text-center text-sm text-muted-foreground">
              備品のQRコードにカメラを向けてください
            </p>
          </CardHeader>
          <CardContent>
            <QrScanner />
          </CardContent>
        </Card>

        <div className="text-center">
          <Link href="/">
            <Button variant="ghost" className="text-sm text-muted-foreground">
              キャンセル（トップへ戻る）
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
