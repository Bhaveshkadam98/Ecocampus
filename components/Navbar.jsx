"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Re-check auth on route change
  useEffect(() => {
    checkAuth();
    setMobileMenuOpen(false); // close mobile menu on navigation
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Scroll listener for navbar background
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Listen for token changes in localStorage
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "token") checkAuth();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

 const checkAuth = async () => {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setUser(null);
      setAuthChecked(true);

      // ✅ Prevent dashboard access when logged out
      if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
        router.push("/login");
      }
      return;
    }

    const response = await fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      setUser(null);
      setAuthChecked(true);
      return;
    }

    const data = await response.json();
    setUser(data.user ?? data);
    setAuthChecked(true);
  } catch (err) {
    console.error("Auth check failed:", err);
    setUser(null);
    setAuthChecked(true);
  }
};


  const handleLogout = () => {
    if (typeof window !== "undefined") localStorage.removeItem("token");
    setUser(null);
    router.push("/");
  };

  return (
    <motion.nav
  initial={{ y: -100 }}
  animate={{ y: 0 }}
  className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
    scrolled
      ? "bg-white/80 backdrop-blur-xl shadow-xl border border-green-200/50 rounded-2xl px-6 py-2 w-[90%] max-w-6xl"
      : "bg-transparent py-4 w-full"
  }`}
  role="navigation"
  aria-label="Primary"
>

      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2" aria-label="Home">
            <span className="text-3xl">🌿</span>
            <span
              className={`text-2xl font-bold ${
                scrolled ? "text-gray-800" : "text-white"
              }`}
            >
              EcoCampus
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/leaderboard"
              className={`font-medium transition-colors hover:text-green-500 ${
                scrolled ? "text-gray-700" : "text-white"
              }`}
            >
              Leaderboard
            </Link>

            <Link
              href="/about"
              className={`font-medium transition-colors hover:text-green-500 ${
                scrolled ? "text-gray-700" : "text-white"
              }`}
            >
              About
            </Link>

            {authChecked &&
              (user ? (
                <>
                  <Link
                    href="/dashboard"
                    className={`font-medium transition-colors hover:text-green-500 ${
                      scrolled ? "text-gray-700" : "text-white"
                    }`}
                  >
                    Dashboard
                  </Link>

                  {user?.role === "admin" && (
                    <Link
                      href="/admin"
                      className={`font-medium transition-colors hover:text-green-500 ${
                        scrolled ? "text-gray-700" : "text-white"
                      }`}
                    >
                      Admin
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className={`font-medium transition-colors hover:text-green-500 ${
                      scrolled ? "text-gray-700" : "text-white"
                    }`}
                    aria-label="Logout"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={`font-medium transition-colors hover:text-green-500 ${
                      scrolled ? "text-gray-700" : "text-white"
                    }`}
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/signup"
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
                    aria-label="Sign up"
                  >
                    Plant Your Seed
                  </Link>
                </>
              ))}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen((s) => !s)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation"
          >
            <svg
              className={`w-6 h-6 ${scrolled ? "text-gray-800" : "text-white"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-4 bg-white rounded-lg shadow-lg p-4"
          >
            <div className="flex flex-col space-y-3">
              <Link
                href="/leaderboard"
                className="text-gray-700 hover:text-green-500"
                onClick={() => setMobileMenuOpen(false)}
              >
                Leaderboard
              </Link>

              {authChecked && user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-gray-700 hover:text-green-500"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-left text-gray-700 hover:text-green-500"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-gray-700 hover:text-green-500"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="text-center bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-full"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Plant Your Seed
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
