"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/present", label: "Slides" },
  { href: "/", label: "Dashboard" },
  { href: "/privacy", label: "Privacy" },
];

// Mobile-only persistent nav (hidden on desktop, where Sidebar covers navigation).
export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="mobile-nav">
      {LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`mobile-nav-link${pathname === link.href ? " active" : ""}`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
