"use client";

import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";

interface QrDisplayProps {
  url: string;
  itemName: string;
}

export function QrDisplay({ url, itemName }: QrDisplayProps) {
  function handlePrint() {
    window.print();
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        id="qr-print-area"
        className="flex flex-col items-center gap-3 p-6 rounded-xl ring-1 ring-foreground/10 bg-white"
      >
        <QRCodeSVG value={url} size={200} />
        <p className="text-sm font-medium text-center max-w-[200px]">
          {itemName}
        </p>
      </div>

      <p className="text-xs text-muted-foreground break-all max-w-xs text-center">
        {url}
      </p>

      <Button onClick={handlePrint} className="print:hidden">
        印刷する
      </Button>

      <style>{`
        @media print {
          body > * {
            display: none;
          }
          #qr-print-area {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}
