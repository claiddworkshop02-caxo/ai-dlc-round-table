"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function QrScanner() {
  const router = useRouter();
  const scannerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const html5QrCodeRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(true);

  useEffect(() => {
    let stopped = false;

    async function startScanner() {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        if (stopped || !scannerRef.current) return;

        const html5QrCode = new Html5Qrcode("qr-reader");
        html5QrCodeRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            // QR読み取り成功: URLから /scan/[id] パスを抽出またはそのままリダイレクト
            const match = decodedText.match(/\/scan\/([^/?#]+)/);
            if (match) {
              html5QrCode.stop().catch(() => {});
              router.push(`/scan/${match[1]}`);
            } else {
              // URLそのもの（外部URL等）の場合はそのまま飛ばす
              html5QrCode.stop().catch(() => {});
              try {
                const url = new URL(decodedText);
                router.push(url.pathname);
              } catch {
                setError(`認識できないQRコードです: ${decodedText}`);
              }
            }
          },
          undefined
        );
        setIsStarting(false);
      } catch (err) {
        if (!stopped) {
          console.error(err);
          setError("カメラを起動できませんでした。カメラへのアクセスを許可してください。");
          setIsStarting(false);
        }
      }
    }

    startScanner();

    return () => {
      stopped = true;
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch(() => {});
      }
    };
  }, [router]);

  return (
    <div className="flex flex-col items-center gap-4">
      {isStarting && !error && (
        <p className="text-sm text-muted-foreground">カメラを起動中...</p>
      )}
      <div
        id="qr-reader"
        ref={scannerRef}
        className="w-full max-w-sm rounded-xl overflow-hidden"
      />
      {error && (
        <div className="w-full max-w-sm rounded-xl bg-red-50 p-4 text-center">
          <p className="text-sm text-red-600">{error}</p>
          <Button
            variant="outline"
            className="mt-3"
            onClick={() => {
              setError(null);
              setIsStarting(true);
              window.location.reload();
            }}
          >
            再試行する
          </Button>
        </div>
      )}
      {!error && !isStarting && (
        <p className="text-sm text-muted-foreground text-center">
          QRコードをカメラに向けてください
        </p>
      )}
    </div>
  );
}
