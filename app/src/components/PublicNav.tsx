"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const APPLY_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScp7GNJ9T58mHrY_zfrcPbWj5i51dffLYVaM72xfH02sCghqw/viewform?usp=sharing&ouid=103224701688413762370";

const NAV_LINKS = [
  { label: "About", href: "/about" },
  { label: "The Program", href: "/program" },
  { label: "Team", href: "/team" },
  { label: "Alumni", href: "/alumni" },
  { label: "FAQ", href: "/faq" },
  { label: "Demo", href: "/demo" },
];

// Pages with a dark hero — nav starts transparent with white text
const DARK_HERO_PAGES = ["/"];

export default function PublicNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const isDarkHero = DARK_HERO_PAGES.includes(pathname);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 60);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const transparent = isDarkHero && !scrolled;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        transparent
          ? "bg-transparent border-b border-transparent"
          : "bg-white/95 backdrop-blur border-b border-gray-100"
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className={`text-lg font-semibold tracking-tight transition-colors ${
              transparent ? "text-white" : "text-gray-900"
            }`}
          >
            Mujin
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
                  transparent
                    ? "text-white/70 hover:text-white hover:bg-white/10"
                    : pathname === link.href
                    ? "text-gray-900 font-medium bg-gray-100"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className={`text-sm font-medium transition-colors px-4 py-2 rounded-lg ${
              transparent
                ? "text-white/80 hover:text-white hover:bg-white/10"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            Log in
          </Link>
          <a
            href={APPLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
              transparent
                ? "bg-white text-gray-900 hover:bg-gray-100"
                : "bg-gray-900 text-white hover:bg-gray-700"
            }`}
          >
            Apply now
          </a>
        </div>
      </div>
    </nav>
  );
}
