"use client";

import { useEffect, useState } from "react";

export type NavbarTheme = "dark" | "light";

const DARK_SECTION_SELECTOR = '[data-nav-theme="dark"]';
const NAVBAR_HEIGHT = 88;

/**
 * Returns "dark" when the navbar overlaps a dark-background section (hero, referral),
 * otherwise "light" for cream/white sections.
 */
export function useNavbarTheme(): NavbarTheme {
  const [theme, setTheme] = useState<NavbarTheme>("dark");

  useEffect(() => {
    const sections = document.querySelectorAll(DARK_SECTION_SELECTOR);

    const update = () => {
      const overDark = Array.from(sections).some((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top < NAVBAR_HEIGHT && rect.bottom > 0;
      });
      setTheme(overDark ? "dark" : "light");
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return theme;
}
