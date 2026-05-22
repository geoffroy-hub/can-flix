"use client";
import { useEffect, useRef } from "react";

export default function CounterAnim() {
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return;
    done.current = true;
    document.querySelectorAll<HTMLElement>(".stat-number[data-count]").forEach((el) => {
      const target = parseInt(el.dataset.count || "0");
      const suffix = el.dataset.suffix || "";
      let current = 0;
      const step = target / 40;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = Math.floor(current) + suffix;
      }, 35);
    });
  }, []);
  return null;
}
