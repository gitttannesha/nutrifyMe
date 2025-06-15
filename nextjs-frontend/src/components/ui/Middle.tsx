import React, { useEffect, useState } from "react";
import HealthIndexPie from "@/components/ui/HealthIndexPie";

export default function Middle({ result }: { result: any }) {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    fetch("/api/user/profile")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch user profile");
        const data = await res.json();
        setUserProfile(data);
      })
      .catch(() => setUserProfile(null))
      .finally(() => setLoadingProfile(false));
  }, []);

  if (!result) return null;
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      {/* Greeting */}
      <div className="mb-8 w-full max-w-2xl">
        <div className="text-2xl md:text-3xl font-extrabold text-zinc-800 mb-1">
          Hello, {result.user.name}!
        </div>
        <div className="text-base md:text-lg text-zinc-400 font-medium">
          Lets begin our journey towards a healthier future
        </div>
      </div>
      {/* Main Card: Health Score, Barcode, Sugar, Sodium */}
      <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center gap-8 w-full max-w-2xl">
        {/* Health Index Pie Chart */}
        <HealthIndexPie score={Math.round(result.health_score)} />
        {/* Barcode, Sugar, Sodium */}
        <div className="flex flex-col items-center w-full max-w-xs gap-6 mt-2">
          {/* Barcode animation */}
          {/* (If you want to move the barcode SVG here, do so) */}
          {/* Sugar Progress Bar */}
          <div className="w-full">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-semibold text-zinc-700">Sugar</span>
              <span className="text-sm font-semibold text-zinc-700">{result.product.sugar}g</span>
            </div>
            <div className="w-full bg-zinc-200 rounded-full h-3">
              <div
                className="h-3 rounded-full bg-pink-400 transition-all duration-700"
                style={{ width: `${Math.min(Number(result.product.sugar) * 3, 100)}%` }}
              />
            </div>
          </div>
          {/* Sodium Progress Bar */}
          <div className="w-full">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-semibold text-zinc-700">Sodium</span>
              <span className="text-sm font-semibold text-zinc-700">{result.product.sodium}g</span>
            </div>
            <div className="w-full bg-zinc-200 rounded-full h-3">
              <div
                className="h-3 rounded-full bg-blue-400 transition-all duration-700"
                style={{ width: `${Math.min(Number(result.product.sodium) * 15, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Suggestions/Info Boxes */}
      <div className="flex flex-row gap-6 mt-8 w-full max-w-2xl">
        {/* Ideal Blood Sugar Level Box */}
        <div className="flex-1 bg-green-200 rounded-xl p-4 flex flex-col justify-between shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-white border-2 border-green-400" />
            <span className="text-green-800 font-bold text-base">Ideal Blood Sugar level</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="font-bold text-green-700 text-lg">70 - 140 mg/dL</span>
            <span className="text-green-700 font-semibold text-sm">normal</span>
          </div>
          <div className="w-full h-2 bg-green-100 rounded-full mt-2">
            <div className="h-2 bg-green-500 rounded-full" style={{ width: "50%" }} />
          </div>
        </div>
        {/* User's Blood Sugar Level Box */}
        <div className="flex-1 bg-yellow-200 rounded-xl p-4 flex flex-col justify-between shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-white border-2 border-yellow-400" />
            <span className="text-yellow-800 font-bold text-base">Your Blood Sugar level</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            {loadingProfile ? (
              <span className="font-bold text-yellow-700 text-lg">Loading...</span>
            ) : (
              <span className="font-bold text-yellow-700 text-lg">{userProfile?.sugarLevel ?? "N/A"} mg/dL</span>
            )}
            <span className="text-yellow-700 font-semibold text-sm">personal</span>
          </div>
          <div className="w-full h-2 bg-yellow-100 rounded-full mt-2">
            <div
              className="h-2 bg-yellow-400 rounded-full"
              style={{ width: userProfile && userProfile.sugarLevel ? `${Math.min((userProfile.sugarLevel / 200) * 100, 100)}%` : "0%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 