"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminShortcut() {
  const router = useRouter();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ctrl + Shift + K → ouvre le panneau admin (caché)
      if (e.ctrlKey && e.shiftKey && e.key === "K") {
        e.preventDefault();
        router.push("/admin");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [router]);

  return null;
}
