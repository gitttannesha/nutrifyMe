"use client";
import React, { useState, useEffect, useCallback } from "react";
import QuaggaScanner from "@/components/QuaggaScanner";
import { useRouter } from "next/navigation";
import { BarcodeFormat, DecodeHintType } from "@zxing/library";
import { BrowserMultiFormatReader } from "@zxing/browser";

export default function ScanPage() {
  const [barcode, setBarcode] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [product, setProduct] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [loadingScore, setLoadingScore] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [scoreError, setScoreError] = useState<string | null>(null);
  const [manualBarcode, setManualBarcode] = useState<string>("");
  const [useManualEntry, setUseManualEntry] = useState(false);
  const [useImageUpload, setUseImageUpload] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch user info on mount
  useEffect(() => {
    setLoadingUser(true);
    fetch("/api/user/profile")
      .then(async (res) => {
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        if (!res.ok) throw new Error("Failed to fetch user profile");
        const data = await res.json();
        setUser(data);
      })
      .catch((e) => {
        setError("Could not fetch user profile. Please log in.");
        console.error(e);
      })
      .finally(() => setLoadingUser(false));
  }, [router]);

  // Fetch product details from backend using barcode only
  const fetchProduct = async (barcode: string) => {
    setLoadingProduct(true);
    setProduct(null);
    setResult(null);
    setScoreError(null);
    try {
      const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const data = await res.json();
      if (data.status === 1 && data.product) {
        setProduct({
          name: data.product.product_name || "N/A",
          barcode: data.product.code,
          sugar: data.product.nutriments?.sugars_100g ?? "N/A",
          sodium: data.product.nutriments?.sodium_100g ?? "N/A",
          ingredients: data.product.ingredients_text || "N/A",
        });
      } else {
        setProduct(null);
        setError("No product details found for this barcode.");
      }
    } catch (e) {
      setProduct(null);
      setError("Network error. Could not fetch product details.");
      console.error(e);
    }
    setLoadingProduct(false);
  };

  const handleDetected = (code: string) => {
    setBarcode(code);
    setManualBarcode(code);
    setError(null);
    setProduct(null);
    setResult(null);
    setScoreError(null);
  };

  const handleManualFetch = () => {
    if (manualBarcode.trim().length === 0) return;
    setBarcode(manualBarcode.trim());
    setError(null);
    setProduct(null);
    setResult(null);
    setScoreError(null);
    fetchProduct(manualBarcode.trim());
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (event) {
      const imageUrl = event.target?.result as string;
      // Use QuaggaJS in single image mode
      // @ts-ignore
      import("quagga").then((Quagga) => {
        Quagga.default.decodeSingle(
          {
            src: imageUrl,
            numOfWorkers: 0,
            inputStream: {
              size: 800,
            },
            decoder: {
              readers: ["ean_reader", "ean_8_reader", "upc_reader", "upc_e_reader"],
            },
          },
          (result: any) => {
            if (result && result.codeResult && result.codeResult.code) {
              setManualBarcode(result.codeResult.code);
              setBarcode(result.codeResult.code);
              fetchProduct(result.codeResult.code);
              setUseImageUpload(false);
            } else {
              setUploadError("Could not detect a barcode in the uploaded image.");
            }
          }
        );
      });
    };
    reader.readAsDataURL(file);
  };

  const handleGetNutriScore = async () => {
    if (!user || !barcode) return;
    setLoadingScore(true);
    setScoreError(null);
    setResult(null);
    try {
      // Map user fields to what backend expects
      const userPayload = {
        age: user.age,
        weight: user.weight,
        height: user.height,
        sugar_level: user.sugarLevel,
        diabetes: user.hasDiabetes ? 1 : 0,
        hypertension: user.hasHypertension ? 1 : 0,
      };
      const res = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: userPayload, barcode }),
      });
      const data = await res.json();
      if (res.ok && data.health_score !== undefined) {
        // Save result to localStorage and redirect to /dashboard
        localStorage.setItem("nutriscore_result", JSON.stringify({
          health_score: data.health_score,
          product: product,
          user: user,
        }));
        // Save to history
        const history = JSON.parse(localStorage.getItem("nutriscore_history") || "[]");
        history.unshift({
          score: data.health_score,
          product: product?.name,
          sugar: product?.sugar,
          sodium: product?.sodium,
          time: new Date().toISOString(),
        });
        localStorage.setItem("nutriscore_history", JSON.stringify(history.slice(0, 100)));
        router.push("/dashboard");
      } else {
        setScoreError(data.error || "Could not calculate NutriScore.");
      }
    } catch (e) {
      setScoreError("Network error. Please ensure the backend is running and reachable.");
      console.error(e);
    }
    setLoadingScore(false);
  };

  const handleRetryProfile = () => {
    setError(null);
    setUser(null);
    setLoadingUser(true);
    fetch("/api/user/profile")
      .then(async (res) => {
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        if (!res.ok) throw new Error("Failed to fetch user profile");
        const data = await res.json();
        setUser(data);
      })
      .catch((e) => {
        setError("Could not fetch user profile. Please log in.");
        console.error(e);
      })
      .finally(() => setLoadingUser(false));
  };

  const handleRetryScanner = () => {
    setBarcode(null);
    setProduct(null);
    setResult(null);
    setError(null);
    setScoreError(null);
  };

  // Layout
  if (error && !user) {
    return (
      <div className="p-8 text-center text-red-500">
        {error}
        <br />
        <button
          onClick={handleRetryProfile}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }
  if (loadingUser || !user) {
    return <div className="p-8 text-center">Loading user profile...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6faff] py-10">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg flex flex-col md:flex-row p-0 overflow-hidden">
        {/* Left: Scanner Section */}
        <div className="flex-1 flex flex-col p-8 gap-4 min-w-[320px]">
          <div className="text-2xl font-bold text-zinc-800 mb-1">Scan barcode <span className="text-zinc-400 font-normal text-lg">camera scan</span></div>
          <div className="flex-1 flex items-center justify-center bg-zinc-100 rounded-xl border border-zinc-200 min-h-[260px] mb-4">
            {/* Scanner, Manual Entry, or Product Details */}
            {product ? (
              // Product Details Card
              <div className="w-full max-w-md p-6 bg-white rounded-xl shadow flex flex-col gap-4 items-start">
                <div className="text-xl font-bold text-green-700 mb-2">{product.name}</div>
                <div className="flex flex-row gap-6 w-full">
                  <div className="flex flex-col gap-1 flex-1">
                    <span className="text-zinc-500 text-sm">Sugar</span>
                    <span className="font-bold text-pink-500 text-lg">{product.sugar}g</span>
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <span className="text-zinc-500 text-sm">Sodium</span>
                    <span className="font-bold text-blue-500 text-lg">{product.sodium}g</span>
                  </div>
                </div>
                <div className="w-full mt-2">
                  <span className="text-zinc-500 text-sm">Ingredients</span>
                  <div className="text-zinc-700 text-sm mt-1 line-clamp-4">{product.ingredients}</div>
                </div>
                <button
                  className="mt-4 w-full bg-green-500 text-white font-bold py-3 rounded-lg shadow hover:bg-green-600 transition-all text-lg"
                  onClick={handleGetNutriScore}
                  disabled={!product || loadingScore}
                >
                  {loadingScore ? "Calculating..." : "Find NutriScore"}
                </button>
                {scoreError && <div className="text-red-500 mt-2">{scoreError}</div>}
              </div>
            ) : useManualEntry ? (
              <div className="w-full flex flex-col items-center">
                <div className="flex w-full gap-2 items-center">
                  <input
                    type="text"
                    value={manualBarcode}
                    onChange={e => setManualBarcode(e.target.value)}
                    placeholder="Enter barcode number"
                    className="border border-zinc-300 px-3 py-2 rounded text-lg w-full bg-white text-zinc-800 m-2"
                  />
                  <button
                    className="bg-green-500 text-white font-bold px-5 py-2 rounded-lg shadow hover:bg-green-600 transition-all m-2"
                    onClick={handleManualFetch}
                  >
                    Submit
                  </button>
                </div>
                {uploadError && <div className="text-red-500 mt-2">{uploadError}</div>}
              </div>
            ) : useImageUpload ? (
              <div className="w-full flex flex-col items-center">
                <div className="flex w-full gap-2 items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full border border-zinc-300 bg-white text-zinc-800 rounded px-2 py-2 m-2"
                  />
                  <button
                    className="bg-green-500 text-white font-bold px-5 py-2 rounded-lg shadow hover:bg-green-600 transition-all m-2"
                    onClick={() => {
                      if (manualBarcode.trim().length > 0) fetchProduct(manualBarcode.trim());
                    }}
                  >
                    Submit
                  </button>
                </div>
                {uploadError && <div className="text-red-500 mt-2">{uploadError}</div>}
              </div>
            ) : (
              <div className="w-full flex flex-col items-center">
                <div className="flex w-full gap-2 items-center">
                  <QuaggaScanner onDetected={handleDetected} onClose={() => router.push("/homepage")} />
                </div>
                {barcode && (
                  <div className="flex w-full gap-2 items-center mt-4">
                    <input
                      type="text"
                      value={manualBarcode}
                      readOnly
                      className="border border-zinc-300 px-3 py-2 rounded text-lg w-full bg-white text-zinc-800 m-2 cursor-not-allowed"
                    />
                    <button
                      className="bg-green-500 text-white font-bold px-5 py-2 rounded-lg shadow hover:bg-green-600 transition-all m-2"
                      onClick={() => fetchProduct(barcode)}
                    >
                      Submit
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Action Buttons */}
          <div className="flex flex-row gap-3 mt-2">
            <button
              className="flex-1 bg-black text-white font-bold py-3 rounded-lg shadow hover:bg-zinc-900 transition-all"
              onClick={() => setUseImageUpload(true)}
            >
              Upload barcode image
            </button>
            <button
              className="flex-1 bg-black text-white font-bold py-3 rounded-lg shadow hover:bg-zinc-900 transition-all"
              onClick={() => setUseManualEntry(true)}
            >
              Enter barcode manually
            </button>
            <button
              className="flex-1 bg-red-500 text-white font-bold py-3 rounded-lg shadow hover:bg-red-600 transition-all"
              onClick={() => router.push("/homepage")}
            >
              Cancel
            </button>
          </div>
        </div>
        {/* Right: User Info Section */}
        <div className="flex-1 flex flex-col p-8 bg-[#f8fafc] border-l border-zinc-200 min-w-[340px] relative">
          {/* Top Row: Avatar, Name, Icon */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-2xl font-bold shadow">
                {user.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <div className="text-xl font-extrabold text-zinc-800 leading-tight">{user.name}</div>
                <div className="text-sm text-zinc-500 font-medium">{user.email}</div>
              </div>
            </div>
            <span className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-100 border border-zinc-200 shadow-sm">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" stroke="#94a3b8" strokeWidth="2"/><path d="M7 9h10M7 13h6" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"/></svg>
            </span>
          </div>
          {/* User Avatar Image */}
          <div className="flex justify-center mb-6">
            <img
              src={user.gender === 'female' ? '/images/femaleava.png' : user.gender === 'male' ? '/images/maleava.png' : '/images/maleava.png'}
              alt="User Avatar"
              className="w-56 h-56 rounded-full object-cover border-4 border-white shadow-md bg-zinc-200"
            />
          </div>
          {/* Divider */}
          <div className="border-b border-zinc-200 mb-4" />
          {/* User Details Grid */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-base">
            <div className="flex items-center gap-2">
              <span className="text-zinc-500 font-semibold">Age:</span>
              <span className="font-bold text-zinc-800">{user.age} yrs</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-zinc-500 font-semibold">Weight:</span>
              <span className="font-bold text-zinc-800">{user.weight} kg</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-zinc-500 font-semibold">Height:</span>
              <span className="font-bold text-zinc-800">{user.height} cm</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-zinc-500 font-semibold">Sugar Level:</span>
              <span className="font-bold text-blue-600">{user.sugarLevel}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-zinc-500 font-semibold">Diabetes:</span>
              <span className={`font-bold ${user.hasDiabetes ? 'text-red-500' : 'text-green-600'}`}>{user.hasDiabetes ? 'Yes' : 'No'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-zinc-500 font-semibold">Hypertension:</span>
              <span className={`font-bold ${user.hasHypertension ? 'text-red-500' : 'text-green-600'}`}>{user.hasHypertension ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}