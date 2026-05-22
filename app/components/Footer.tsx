import Link from "next/link";

const LogoSvg = () => (
  <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
);

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="footer-logo">
              <div className="footer-logo-icon"><LogoSvg /></div>
              Canflix
            </Link>
            <p>Premium digital marketplace for apps and courses. Netflix, Canal+, and expert digital education — all in one place.</p>
            <div className="footer-socials">
              {["twitter", "instagram", "tiktok", "youtube"].map((s) => (
                <a key={s} href="#" className="footer-social" aria-label={s}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
          <div className="footer-col">
            <h5>Products</h5>
            <div className="footer-links">
              <Link href="/apps">Netflix Premium</Link>
              <Link href="/apps">Canal+ Premium</Link>
              <Link href="/courses">TikTok Course</Link>
              <Link href="/courses">YouTube Growth</Link>
              <Link href="/courses">Trading Masterclass</Link>
            </div>
          </div>
          <div className="footer-col">
            <h5>Company</h5>
            <div className="footer-links">
              <Link href="/">About Us</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/">Blog</Link>
              <Link href="/">Careers</Link>
              <Link href="/">Press</Link>
            </div>
          </div>
          <div className="footer-col">
            <h5>Support</h5>
            <div className="footer-links">
              <Link href="/contact">Help Center</Link>
              <Link href="/">Privacy Policy</Link>
              <Link href="/">Terms of Service</Link>
              <Link href="/">Refund Policy</Link>
              <Link href="/">WhatsApp Support</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Canflix. All rights reserved.</span>
          <div className="footer-bottom-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
