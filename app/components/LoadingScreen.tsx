"use client";
import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHidden(true), 1600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`loading-screen${hidden ? " hidden" : ""}`}>
      <div className="loading-logo">
        <div className="loading-logo-icon">
          <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
        </div>
        Canflix
      </div>
      <div className="loading-bar-wrap">
        <div className="loading-bar" />
      </div>
      <div className="loading-text">Loading premium experience...</div>
    </div>
  );
}
