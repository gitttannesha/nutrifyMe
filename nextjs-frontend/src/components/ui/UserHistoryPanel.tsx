import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const todayIdx = 1; // e.g., Tuesday
const mockHistory = [
  {
    type: "Breakfast",
    kcal: 300,
    name: "Scrambled Eggs with Spinach & Whole Grain Toast",
    img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=facearea&w=64&h=64&q=80",
    macros: { C: 25, P: 20, F: 12 },
  },
  {
    type: "Lunch",
    kcal: 450,
    name: "Grilled Chicken Salad with Avocado and Quinoa",
    img: "https://images.unsplash.com/photo-1516685018646-5499d0a7d42f?auto=format&fit=facearea&w=64&h=64&q=80",
    macros: { C: 40, P: 35, F: 20 },
  },
  {
    type: "Snack",
    kcal: 200,
    name: "Greek Yogurt with Mixed Berries and Almonds",
    img: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=facearea&w=64&h=64&q=80",
    macros: { C: 18, P: 12, F: 10 },
  },
  {
    type: "Dinner",
    kcal: 500,
    name: "Grilled Chicken with Sweet Potato and Green Beans",
    img: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=facearea&w=64&h=64&q=80",
    macros: { C: 45, P: 35, F: 20 },
  },
];

const typeColors: Record<string, string> = {
  Breakfast: "bg-green-100 text-green-700 border-green-400",
  Lunch: "bg-lime-100 text-lime-700 border-lime-400",
  Snack: "bg-yellow-100 text-yellow-700 border-yellow-400",
  Dinner: "bg-orange-100 text-orange-700 border-orange-400",
};

export default function UserHistoryPanel() {
  return (
    <aside className="w-full md:w-[340px] flex-shrink-0 bg-white rounded-2xl shadow-lg p-6 mt-10 md:mt-0 md:ml-8">
      {/* Calendar Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <button className="p-1 rounded hover:bg-zinc-100"><FiChevronLeft /></button>
          <span className="font-bold text-zinc-700 text-lg">September - 2028</span>
          <button className="p-1 rounded hover:bg-zinc-100"><FiChevronRight /></button>
        </div>
        <div className="flex justify-between mb-1 text-xs text-zinc-400 font-bold">
          {days.map((d, i) => (
            <span key={d} className={i === todayIdx ? "text-green-600" : ""}>{d}</span>
          ))}
        </div>
        <div className="flex justify-between">
          {days.map((_, i) => (
            <div
              key={i}
              className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-zinc-700 ${
                i === todayIdx ? "bg-green-100 border-2 border-green-500 text-green-700" : ""
              }`}
            >
              {4 + i}
            </div>
          ))}
        </div>
      </div>
      {/* History List */}
      <div className="space-y-4">
        {mockHistory.map((item, idx) => (
          <div key={idx} className="flex items-start gap-3 bg-zinc-50 rounded-xl p-3 shadow-sm">
            <img
              src={item.img}
              alt={item.type}
              className="w-12 h-12 rounded-lg object-cover border border-zinc-200"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2 py-0.5 rounded text-xs font-bold border ${typeColors[item.type]}`}>{item.type}</span>
                <span className="bg-zinc-200 text-zinc-700 text-xs font-bold px-2 py-0.5 rounded ml-1">{item.kcal} kcal</span>
              </div>
              <div className="font-semibold text-zinc-700 text-sm mb-1 truncate">{item.name}</div>
              <div className="flex gap-3 text-xs text-zinc-500 font-bold">
                <span>C {item.macros.C}g</span>
                <span>P {item.macros.P}g</span>
                <span>F {item.macros.F}g</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
} 