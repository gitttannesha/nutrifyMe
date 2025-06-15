"use client";
import React, { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

type Props = {
  onDetected: (barcode: string) => void;
  onClose: () => void;
};

const Html5QrcodeScanner: React.FC<Props> = ({ onDetected, onClose }) => {
  const scannerRef = useRef<HTMLDivElement>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    if (!scannerRef.current) return;
    const html5QrCode = new Html5Qrcode("reader");
    html5QrCodeRef.current = html5QrCode;

    html5QrCode.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: { width: 300, height: 150 },
      },
      (decodedText) => {
        onDetected(decodedText);
        html5QrCode.stop().then(() => {
          // Clean up
        });
      },
      (errorMessage) => {
        // Optionally handle scan errors
      }
    );

    return () => {
      html5QrCode.stop().catch(() => {});
      html5QrCode.clear().catch(() => {});
    };
  }, [onDetected]);

  return (
    <div className="flex flex-col items-center">
      <div id="reader" ref={scannerRef} style={{ width: 350 }} />
      <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-200 rounded">
        Cancel
      </button>
    </div>
  );
};

export default Html5QrcodeScanner; 