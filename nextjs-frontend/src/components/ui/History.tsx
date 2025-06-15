import React, { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiTrash2 } from "react-icons/fi";

function getDaySuffix(day: number) {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}

function formatTime(date: Date) {
  let h = date.getHours();
  const m = date.getMinutes();
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  h = h ? h : 12;
  return `${h}:${m.toString().padStart(2, "0")} ${ampm}`;
}

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function groupLogsByDay(logs: any[]) {
  const now = new Date();
  // previous 3 days and today
  return [3, 2, 1, 0].map((offset) => {
    const date = new Date(now);
    date.setDate(now.getDate() - offset);
    const dayStr = date.toISOString().slice(0, 10);
    return {
      date: dayStr,
      logs: logs.filter((log) => log.time && log.time.slice(0, 10) === dayStr),
    };
  });
}

function getScoreColor(score: number) {
  if (score > 80) return "text-green-600";
  if (score > 65) return "text-orange-400";
  if (score > 45) return "text-blue-500";
  return "text-red-500";
}

export default function History() {
  const [history, setHistory] = useState<any[]>([]);
  const [selectedDay, setSelectedDay] = useState(3); // 0: 3 days ago, 3: today
  const now = new Date();
  const month = now.toLocaleString("default", { month: "long" });
  const year = now.getFullYear();

  useEffect(() => {
    const logs = JSON.parse(localStorage.getItem("nutriscore_history") || "[]");
    setHistory(groupLogsByDay(logs));
  }, []);

  const handleDelete = (logIdx: number) => {
    const logs = JSON.parse(localStorage.getItem("nutriscore_history") || "[]");
    const logToDelete = history[selectedDay].logs[logIdx];
    const newLogs = logs.filter((l: any) => l.time !== logToDelete.time);
    localStorage.setItem("nutriscore_history", JSON.stringify(newLogs));
    setHistory(groupLogsByDay(newLogs));
  };

  return (
    <aside className="w-full md:w-[340px] flex-shrink-0 bg-white rounded-2xl shadow-lg p-6 mt-10 md:mt-0 md:ml-8">
      {/* Calendar Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <button className="p-1 rounded hover:bg-zinc-100" disabled><FiChevronLeft /></button>
          <span className="font-bold text-zinc-700 text-lg">{month} - {year}</span>
          <button className="p-1 rounded hover:bg-zinc-100" disabled><FiChevronRight /></button>
        </div>
        {/* Days and Dates aligned in columns */}
        <div className="flex justify-between gap-1">
          {history.map((d, i) => {
            const date = new Date(d.date);
            return (
              <div key={i} className="flex flex-col items-center w-1/4">
                <span className={`text-xs font-bold mb-1 ${i === selectedDay ? "text-green-600" : "text-zinc-400"}`}>
                  {daysOfWeek[date.getDay()].toLowerCase()}
                </span>
                <button
                  className={`w-12 h-8 flex items-center justify-center rounded-full font-bold text-zinc-700 transition-all duration-150 ${
                    i === selectedDay ? "bg-green-100 border-2 border-green-500 text-green-700" : "hover:bg-zinc-100"
                  }`}
                  onClick={() => setSelectedDay(i)}
                >
                  {date.getDate()}
                  <span className="text-xs font-normal ml-0.5">{getDaySuffix(date.getDate())}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
      {/* History List for selected day */}
      <div className="space-y-4">
        {selectedDay !== 3 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <button className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl font-bold text-base shadow hover:bg-zinc-900 transition-all">
              <span className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#fde68a"/><path d="M12 7v4l2 2" stroke="#f59e42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
              Get plus subscription
            </button>
          </div>
        ) : history[3]?.logs.length === 0 ? (
          <div className="text-zinc-400 text-center py-4">No scans yet</div>
        ) : (
          history[3]?.logs.map((item: any, idx: number) => (
            <div key={item.time} className="flex flex-col gap-1 bg-zinc-50 rounded-xl p-3 shadow-sm relative">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-lg font-extrabold ${getScoreColor(item.score)}`}>{Math.round(item.score)}</span>
                <span className="text-xs text-zinc-500">NutriScore</span>
                <span className="ml-auto text-xs text-zinc-700 font-bold">{formatTime(new Date(item.time))}</span>
              </div>
              <div className="font-semibold text-zinc-700 text-sm mb-1 truncate">{item.product}</div>
              <div className="flex gap-4 text-xs text-zinc-500 font-bold">
                <span>Sugar - {item.sugar}g</span>
                <span>Sodium - {item.sodium}g</span>
              </div>
              <button
                className="mt-2 ml-auto text-zinc-400 hover:text-red-500 flex items-center gap-1 text-sm"
                onClick={() => handleDelete(idx)}
                title="Delete log"
              >
                <FiTrash2 /> Delete
              </button>
            </div>
          ))
        )}
      </div>
    </aside>
  );
} 