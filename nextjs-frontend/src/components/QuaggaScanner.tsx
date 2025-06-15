"use client";
import React, { useEffect, useRef } from "react";
import Quagga from "quagga";

type Props = {
  onDetected: (barcode: string) => void;
  onClose: () => void;
};

const QuaggaScanner: React.FC<Props> = ({ onDetected, onClose }) => {
  const scannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scannerRef.current) return;
    Quagga.init(
      {
        inputStream: {
          type: "LiveStream",
          target: scannerRef.current,
          constraints: {
            width: 640,
            height: 480,
            facingMode: "environment",
          },
        },
        decoder: {
          readers: ["ean_reader", "ean_8_reader", "upc_reader", "upc_e_reader"],
        },
        locate: true,
      },
      (err: any) => {
        if (err) {
          console.error("Quagga init error:", err);
          return;
        }
        Quagga.start();
      }
    );

    Quagga.onDetected((data: any) => {
      if (data && data.codeResult && data.codeResult.code) {
        onDetected(data.codeResult.code);
        Quagga.stop();
      }
    });

    return () => {
      Quagga.offDetected(() => {});
      Quagga.stop();
    };
  }, [onDetected]);

  return (
    <div className="flex flex-col items-center">
      <div ref={scannerRef} style={{ width: 400, height: 300 }} />
    </div>
  );
};

export default QuaggaScanner; 