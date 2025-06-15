import React, { useEffect, useRef } from "react";

interface HealthIndexPieProps {
  score: number;
}

function getColor(score: number) {
  if (score > 80) return "#22c55e"; // green-500
  if (score > 65) return "#f59e42"; // orange-400
  if (score > 45) return "#3b82f6"; // blue-500
  return "#ef4444"; // red-500
}

export default function HealthIndexPie({ score }: HealthIndexPieProps) {
  const radius = 71;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const progress = Math.max(0, Math.min(score, 100));
  const offset = circumference - (progress / 100) * circumference;
  const color = getColor(score);

  return (
    <div className="relative w-36 h-36 flex items-center justify-center">
      <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg]">
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold text-zinc-800">{score}</span>
        <span className="text-md font-semibold text-zinc-500 mt-1">Health Score</span>
      </div>
    </div>
  );
} 