"use client";



import { useEffect, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";

import { NAV_LINKS, WHATSAPP_URL } from "../lib/constants";

import { useNavbarTheme } from "../lib/useNavbarTheme";

import { NavbarLogoLink } from "./BrandLogo";

import { useAuth } from "@/contexts/AuthContext";

import { useRouter } from "next/navigation";



export default function Navbar() {

  const theme = useNavbarTheme();

  const [menuOpen, setMenuOpen] = useState(false);

  const { isAuthenticated } = useAuth();

  const router = useRouter();

  const isDark = theme === "dark";



  useEffect(() => {

    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {

      document.body.style.overflow = "";

    };

  }, [menuOpen]);



  const linkColor = isDark

    ? "rgba(248,246,240,0.88)"

    : "rgba(15,41,29,0.78)";

  const linkHover = isDark ? "#F8F6F0" : "#0F291D";

  const handleOrderClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      router.push("/login?redirect=/#products");
    }
  };

  return (

    <motion.header

      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out"

      style={{

        background: isDark

          ? "rgba(15, 41, 29, 0.08)"

          : "rgba(248, 246, 240, 0.88)",

        backdropFilter: "blur(20px)",

        WebkitBackdropFilter: "blur(20px)",

        borderBottom: isDark

          ? "1px solid rgba(248, 246, 240, 0.08)"

          : "1px solid rgba(15, 41, 29, 0.08)",

      }}

      initial={{ y: -88, opacity: 0 }}

      animate={{ y: 0, opacity: 1 }}

      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}

    >

      <nav

        className="mx-auto flex h-[88px] max-w-[1440px] items-center justify-between px-[5%]"

        aria-label="Main navigation"

      >

        <NavbarLogoLink theme={theme} />



        {/* Desktop Nav */}

        <ul className="hidden md:flex items-center gap-10 list-none m-0 p-0">

          {NAV_LINKS.map((link) => (

            <li key={link.href}>

              <a

                href={link.href}

                className="relative text-[0.8125rem] font-medium tracking-[0.06em] transition-colors duration-300 after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-[#D4AF37] after:transition-all after:duration-300 hover:after:w-full"

                style={{ color: linkColor }}

                onMouseEnter={(e) => {

                  e.currentTarget.style.color = linkHover;

                }}

                onMouseLeave={(e) => {

                  e.currentTarget.style.color = linkColor;

                }}

              >

                {link.label}

              </a>

            </li>

          ))}

          {/* Auth Links */}
          {!isAuthenticated ? (
            <>
              <li>
                <a
                  href="/login"
                  className="relative text-[0.8125rem] font-medium tracking-[0.06em] transition-colors duration-300 after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-[#D4AF37] after:transition-all after:duration-300 hover:after:w-full"
                  style={{ color: linkColor }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = linkHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = linkColor;
                  }}
                >
                  Login
                </a>
              </li>
              <li>
                <a
                  href="/signup"
                  className="relative text-[0.8125rem] font-medium tracking-[0.06em] transition-colors duration-300 after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-[#D4AF37] after:transition-all after:duration-300 hover:after:w-full"
                  style={{ color: linkColor }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = linkHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = linkColor;
                  }}
                >
                  Sign Up
                </a>
              </li>
            </>
          ) : (
            <li>
              <a
                href="/profile"
                className="relative text-[0.8125rem] font-medium tracking-[0.06em] transition-colors duration-300 after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-[#D4AF37] after:transition-all after:duration-300 hover:after:w-full"
                style={{ color: linkColor }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = linkHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = linkColor;
                }}
              >
                Profile
              </a>
            </li>
          )}

          <li>

            <a

              href="#products"

              rel="noopener noreferrer"

              onClick={handleOrderClick}

              className="inline-flex items-center text-[0.75rem] font-semibold px-6 py-2.5 rounded-full tracking-[0.04em] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(212,175,55,0.28)]"

              style={{

                background: isDark ? "#D4AF37" : "#0F291D",

                color: isDark ? "#0F291D" : "#F8F6F0",

              }}

            >

              Order Now

            </a>

          </li>

        </ul>



        {/* Mobile Menu Button */}

        <button

          type="button"

          className="md:hidden flex h-10 w-10 items-center justify-center rounded-full border-none cursor-pointer transition-colors duration-300"

          style={{

            color: isDark ? "#F8F6F0" : "#0F291D",

            background: isDark

              ? "rgba(248,246,240,0.08)"

              : "rgba(15,41,29,0.05)",

          }}

          onClick={() => setMenuOpen(!menuOpen)}

          aria-label={menuOpen ? "Close menu" : "Open menu"}

          aria-expanded={menuOpen}

        >

          <span className="text-lg leading-none">{menuOpen ? "✕" : "☰"}</span>

        </button>

      </nav>



      {/* Mobile Menu */}

      <AnimatePresence>

        {menuOpen && (

          <motion.div

            className="md:hidden border-t"

            style={{

              background: "rgba(248, 246, 240, 0.96)",

              backdropFilter: "blur(20px)",

              WebkitBackdropFilter: "blur(20px)",

              borderColor: "rgba(15, 41, 29, 0.08)",

            }}

            initial={{ opacity: 0, height: 0 }}

            animate={{ opacity: 1, height: "auto" }}

            exit={{ opacity: 0, height: 0 }}

            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}

          >

            <div className="px-[5%] py-6 space-y-1">

              {NAV_LINKS.map((link) => (

                <a

                  key={link.href}

                  href={link.href}

                  className="block py-3.5 text-sm font-medium tracking-wide text-[#0F291D] border-b border-[#0F291D]/6 last:border-0"

                  onClick={() => setMenuOpen(false)}

                >

                  {link.label}

                </a>

              ))}

              {/* Mobile Auth Links */}
              {!isAuthenticated ? (
                <>
                  <a
                    href="/login"
                    className="block py-3.5 text-sm font-medium tracking-wide text-[#0F291D] border-b border-[#0F291D]/6"
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </a>
                  <a
                    href="/signup"
                    className="block py-3.5 text-sm font-medium tracking-wide text-[#0F291D] border-b border-[#0F291D]/6"
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign Up
                  </a>
                </>
              ) : (
                <a
                  href="/profile"
                  className="block py-3.5 text-sm font-medium tracking-wide text-[#0F291D] border-b border-[#0F291D]/6"
                  onClick={() => setMenuOpen(false)}
                >
                  Profile
                </a>
              )}

              <div className="pt-4">

                <a

                  href={WHATSAPP_URL}

                  target="_blank"

                  rel="noopener noreferrer"

                  onClick={(e) => {
                    handleOrderClick(e);
                    setMenuOpen(false);
                  }}

                  className="block text-center py-3.5 rounded-full text-sm font-semibold tracking-wide text-[#F8F6F0] bg-[#0F291D] transition-transform duration-300 hover:-translate-y-0.5"

                >

                  Order Now

                </a>

              </div>

            </div>

          </motion.div>

        )}

      </AnimatePresence>

    </motion.header>

  );

}

