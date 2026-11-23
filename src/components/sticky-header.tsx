"use client";

import { useEffect, useState, type ReactNode } from "react";

// Transparent over the hero, solid once the page scrolls.
export function StickyHeader({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-scrolled={scrolled}
      className="group/header fixed inset-x-0 top-0 z-40 border-b border-transparent bg-linear-to-b from-background/80 to-transparent bg-origin-border transition-colors duration-300 data-[scrolled=true]:border-border data-[scrolled=true]:bg-background has-[#mobile-menu]:bg-background motion-reduce:transition-none"
    >
      {children}
    </header>
  );
}
