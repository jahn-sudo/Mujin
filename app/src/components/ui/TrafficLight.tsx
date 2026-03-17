"use client";

type Label = "GREEN" | "YELLOW" | "RED" | string | null;

const COLOR: Record<string, string> = {
  GREEN: "bg-green-500",
  YELLOW: "bg-yellow-400",
  RED: "bg-red-500",
};

const EMOJI: Record<string, string> = {
  GREEN: "🟢",
  YELLOW: "🟡",
  RED: "🔴",
};

interface Props {
  label: Label;
  score?: number | null;
  size?: "sm" | "md" | "lg";
}

export function TrafficLight({ label, score, size = "md" }: Props) {
  const color = label ? (COLOR[label] ?? "bg-gray-300") : "bg-gray-200";
  const emoji = label ? (EMOJI[label] ?? "⚪") : "⚪";

  const dot =
    size === "sm" ? "w-3 h-3" : size === "lg" ? "w-6 h-6" : "w-4 h-4";

  if (score !== undefined && score !== null) {
    return (
      <span className="inline-flex items-center gap-1.5 font-mono font-semibold">
        <span className={`inline-block rounded-full ${dot} ${color}`} />
        <span>{Math.round(score)}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-sm">
      <span className={`inline-block rounded-full ${dot} ${color}`} />
      <span className="sr-only">{emoji}</span>
    </span>
  );
}
