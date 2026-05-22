"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const LogoSvg = () => (
  <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
);

const MoonSvg = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const SunSvg = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const links = [
  { href: "/", label: "Home" },
  { href: "/apps", label: "Applications" },
  { href: "/courses", label: "Courses" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("canflix-theme") || "light";
    setTheme(saved);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("canflix-theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  return (
    <>
      <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
        <div className="container navbar-inner">
          <Link href="/" className="nav-logo">
            <div className="nav-logo-icon"><LogoSvg /></div>
            Can<span>flix</span>
          </Link>
          <ul className="nav-menu">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={`nav-link${pathname === l.href ? " active" : ""}`}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="nav-actions">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === "dark" ? <SunSvg /> : <MoonSvg />}
            </button>
            <Link href="/login" className="btn btn-ghost btn-sm nav-login">Login</Link>
            <Link href="/register" className="btn btn-primary btn-sm nav-register">Get Started</Link>
          </div>
          <button
            className={`hamburger${mobileOpen ? " open" : ""}`}
            aria-label="Menu"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>
      <div className={`mobile-nav${mobileOpen ? " open" : ""}`}>
        {links.map((l) => (
          <Link key={l.href} href={l.href} className={`nav-link${pathname === l.href ? " active" : ""}`} onClick={() => setMobileOpen(false)}>
            {l.label}
          </Link>
        ))}
        <div className="mobile-nav-actions">
          <Link href="/login" className="btn btn-outline" onClick={() => setMobileOpen(false)}>Login</Link>
          <Link href="/register" className="btn btn-primary" onClick={() => setMobileOpen(false)}>Get Started</Link>
        </div>
      </div>
    </>
  );
}
