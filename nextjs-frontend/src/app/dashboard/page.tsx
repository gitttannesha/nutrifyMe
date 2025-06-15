"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/ui/Sidebar";
import Middle from "@/components/ui/Middle";
import History from "@/components/ui/History";

export default function Dashboard() {
  const [result, setResult] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("nutriscore_result");
    if (stored) {
      setResult(JSON.parse(stored));
    }
  }, []);

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
        <div className="text-2xl font-bold mb-4">No NutriScore result found.</div>
        <button
          className="px-6 py-3 bg-green-500 text-white rounded-full text-lg font-bold shadow hover:bg-green-600 transition-all"
          onClick={() => router.push("/scan")}
        >
          Go to Scan
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-row min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-[#f6faff]">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row gap-8 items-start justify-center">
          <Middle result={result} />
          <div className="w-full md:w-[360px]">
            <History />
          </div>
        </div>
      </main>
    </div>
  );
} 