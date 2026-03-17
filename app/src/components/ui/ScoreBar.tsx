"use client";

interface Props {
  label: string;
  value: number | null;
}

export function ScoreBar({ label, value }: Props) {
  const pct = value !== null ? Math.round(value) : 0;
  const color =
    pct >= 75 ? "bg-green-500" : pct >= 50 ? "bg-yellow-400" : "bg-red-400";

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-32 shrink-0 text-gray-600">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-8 text-right font-mono text-gray-700 text-xs">
        {value !== null ? `${pct}%` : "—"}
      </span>
    </div>
  );
}
