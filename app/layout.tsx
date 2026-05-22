import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoadingScreen from "./components/LoadingScreen";
import { NotifProvider } from "./components/Notifications";
import AdminShortcut from "./components/AdminShortcut";

export const metadata: Metadata = {
  title: "Canflix - Apps Premium & Cours Numeriques",
  description: "Netflix Premium, Canal+ Premium, formations TikTok, YouTube & Trading.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <NotifProvider>
          <LoadingScreen />
          <AdminShortcut />
          <Navbar />
          <main>{children}</main>
          <Footer />
        </NotifProvider>
      </body>
    </html>
  );
}
