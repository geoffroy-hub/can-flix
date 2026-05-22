"use client";
import { createContext, useCallback, useContext, useState } from "react";

interface Notif { id: number; title: string; message: string; type: "success" | "error" | "info" }
interface NotifCtxType { show: (title: string, message: string, type?: Notif["type"], duration?: number) => void }
const NotifCtx = createContext<NotifCtxType>({ show: () => {} });

export function NotifProvider({ children }: { children: React.ReactNode }) {
  const [notifs, setNotifs] = useState<Notif[]>([]);

  const show = useCallback((title: string, message: string, type: Notif["type"] = "info", duration = 4000) => {
    const id = Date.now();
    setNotifs((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => setNotifs((prev) => prev.filter((n) => n.id !== id)), duration);
  }, []);

  const icons = {
    success: "✓", error: "✕", info: "ℹ"
  };

  return (
    <NotifCtx.Provider value={{ show }}>
      {children}
      <div className="notification-container">
        {notifs.map((n) => (
          <div key={n.id} className="notification show">
            <div className={`notification-icon ${n.type}`}>{icons[n.type]}</div>
            <div>
              <div className="notification-title">{n.title}</div>
              <div className="notification-msg">{n.message}</div>
            </div>
          </div>
        ))}
      </div>
    </NotifCtx.Provider>
  );
}

export const useNotif = () => useContext(NotifCtx);
export default function Notifications() { return null; }
