"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaUserCircle, FaWeight, FaRulerVertical, FaBirthdayCake, FaTint, FaHeartbeat } from "react-icons/fa";
import { MdOutlineBloodtype } from "react-icons/md";

export default function EditProfilePage() {
  const [form, setForm] = useState({
    age: "",
    height: "",
    weight: "",
    sugarLevel: "",
    hasDiabetes: false,
    hasHypertension: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/user/profile")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch user profile");
        const data = await res.json();
        setForm({
          age: data.age?.toString() || "",
          height: data.height?.toString() || "",
          weight: data.weight?.toString() || "",
          sugarLevel: data.sugarLevel?.toString() || "",
          hasDiabetes: !!data.hasDiabetes,
          hasHypertension: !!data.hasHypertension,
        });
      })
      .catch(() => setError("Could not fetch user profile."))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleClear = () => {
    setForm({
      age: "",
      height: "",
      weight: "",
      sugarLevel: "",
      hasDiabetes: false,
      hasHypertension: false,
    });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age: Number(form.age),
          height: Number(form.height),
          weight: Number(form.weight),
          sugarLevel: Number(form.sugarLevel),
          hasDiabetes: form.hasDiabetes,
          hasHypertension: form.hasHypertension,
        }),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      setSuccess("Profile updated successfully!");
      setTimeout(() => router.push("/dashboard"), 1200);
    } catch (err) {
      setError("Could not update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-10 flex flex-col gap-8 border border-green-100 relative"
      >
        {/* Avatar */}
        <div className="flex flex-col items-center -mt-16 mb-2">
          <div className="bg-gradient-to-tr from-green-400 to-blue-400 rounded-full p-1 shadow-lg">
            <FaUserCircle className="text-white" size={80} />
          </div>
          <div className="text-lg font-bold text-zinc-700 mt-2">Your Health Profile</div>
        </div>
        {/* Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-zinc-600 font-semibold mb-1">
              <FaBirthdayCake className="text-pink-400" /> Age
            </label>
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-zinc-200 bg-white text-zinc-800 focus:outline-none focus:ring-2 focus:ring-green-400"
              min={1}
              max={120}
              required
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-zinc-600 font-semibold mb-1">
              <FaRulerVertical className="text-blue-400" /> Height (cm)
            </label>
            <input
              type="number"
              name="height"
              value={form.height}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-zinc-200 bg-white text-zinc-800 focus:outline-none focus:ring-2 focus:ring-green-400"
              min={50}
              max={250}
              required
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-zinc-600 font-semibold mb-1">
              <FaWeight className="text-yellow-500" /> Weight (kg)
            </label>
            <input
              type="number"
              name="weight"
              value={form.weight}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-zinc-200 bg-white text-zinc-800 focus:outline-none focus:ring-2 focus:ring-green-400"
              min={10}
              max={300}
              required
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-zinc-600 font-semibold mb-1">
              <MdOutlineBloodtype className="text-red-400" /> Sugar Level (mg/dL)
            </label>
            <input
              type="number"
              name="sugarLevel"
              value={form.sugarLevel}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-zinc-200 bg-white text-zinc-800 focus:outline-none focus:ring-2 focus:ring-green-400"
              min={40}
              max={500}
              required
            />
            {/* Sugar Level Progress Bar */}
            <div className="mt-2">
              <div className="flex justify-between text-xs text-zinc-400 mb-1">
                <span>Low</span>
                <span>Normal</span>
                <span>High</span>
              </div>
              <div className="w-full h-2 rounded-full bg-zinc-100 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    Number(form.sugarLevel) < 70
                      ? "bg-blue-400 w-1/6"
                      : Number(form.sugarLevel) < 140
                      ? "bg-green-400 w-3/6"
                      : "bg-red-400 w-full"
                  }`}
                  style={{ width: `${Math.min((Number(form.sugarLevel) / 500) * 170, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        {/* Health Conditions */}
        <div className="flex gap-32 mt-2 items-center">
          <label className="flex items-center gap-2 text-zinc-700 font-semibold">
            <FaTint className="text-red-500" />
            <input
              type="checkbox"
              name="hasDiabetes"
              checked={form.hasDiabetes}
              onChange={handleChange}
              className="accent-red-500 w-5 h-5"
            />
            Diabetes
          </label>
          <label className="flex items-center gap-2 text-zinc-700 font-semibold">
            <FaHeartbeat className="text-blue-500" />
            <input
              type="checkbox"
              name="hasHypertension"
              checked={form.hasHypertension}
              onChange={handleChange}
              className="accent-blue-500 w-5 h-5"
            />
            Hypertension
          </label>
        </div>
        {/* Feedback */}
        {error && <div className="text-red-500 text-center font-semibold animate-pulse">{error}</div>}
        {success && <div className="text-green-600 text-center font-semibold animate-bounce">{success}</div>}
        {/* Buttons */}
        <div className="flex gap-4 mt-4">
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-green-400 to-blue-400 text-white font-bold py-3 rounded-xl shadow-lg hover:from-green-500 hover:to-blue-500 transition-all text-lg flex items-center justify-center gap-2 disabled:opacity-60"
            disabled={saving}
          >
            {saving ? (
              <span className="flex items-center gap-2"><span className="loader"></span> Saving...</span>
            ) : (
              <>
              Confirm changes
              </>
            )}
          </button>
          <button
            type="button"
            className="flex-1 bg-gradient-to-r from-red-400 to-pink-400 text-white font-bold py-3 rounded-xl shadow-lg hover:from-red-500 hover:to-pink-500 transition-all text-lg flex items-center justify-center gap-2"
            onClick={handleClear}
          >
           Clear all
          </button>
        </div>
      </form>
    </div>
  );
} 