"use client";
import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

type Props = {
  onDetected: (barcode: string) => void;
  onClose: () => void;
};

const BarcodeScanner: React.FC<Props> = ({ onDetected, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    let active = true;
    const codeReader = new BrowserMultiFormatReader();
    codeReaderRef.current = codeReader;
    let stream: MediaStream | null = null;

    BrowserMultiFormatReader.listVideoInputDevices()
      .then((videoInputDevices: MediaDeviceInfo[]) => {
        if (videoInputDevices.length === 0) {
          setError("No webcam found.");
          return;
        }
        codeReader.decodeFromVideoDevice(
          undefined,
          videoRef.current!,
          (result: any, err: unknown) => {
            if (result && active) {
              onDetected(result.getText());
              // Stop the video stream
              if (videoRef.current && videoRef.current.srcObject) {
                stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach((track) => track.stop());
              }
              active = false;
            }
            if (err && err instanceof Error && err.name === "NotFoundException") {
              // Ignore not found errors (no barcode in frame)
            } else if (err && err instanceof Error) {
              setError("Error scanning barcode.");
            }
          }
        );
      })
      .catch(() => setError("Could not access webcam."));

    return () => {
      // Stop the video stream on unmount
      if (videoRef.current && videoRef.current.srcObject) {
        stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
      active = false;
    };
  }, [onDetected]);

  return (
    <div className="flex flex-col items-center">
      <video ref={videoRef} style={{ width: "100%", maxWidth: 400 }} />
      {error && <div className="text-red-500">{error}</div>}
      <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-200 rounded">
        Cancel
      </button>
    </div>
  );
};

export default BarcodeScanner;