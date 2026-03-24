"use client";

import { useEffect, useRef } from "react";

interface Props {
  children: React.ReactNode;
  delay?: 0 | 1 | 2 | 3;
  className?: string;
}

const DELAY_CLASS: Record<number, string> = {
  0: "",
  1: "fade-up-delay-1",
  2: "fade-up-delay-2",
  3: "fade-up-delay-3",
};

export default function FadeUp({ children, delay = 0, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`fade-up ${DELAY_CLASS[delay]} ${className}`}>
      {children}
    </div>
  );
}
