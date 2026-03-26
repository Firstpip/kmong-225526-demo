"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { getCartCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string>("user");
  const [toast, setToast] = useState<string | null>(null);
  const count = getCartCount();

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    const loggedIn = localStorage.getItem("shop-demo-logged-in") === "true";
    setIsLoggedIn(loggedIn);
    setRole(localStorage.getItem("shop-demo-role") || "user");
  }, [pathname]);

  // Listen for toast events from AuthGuard
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail) showToast(detail);
    };
    window.addEventListener("shop-toast", handler);
    return () => window.removeEventListener("shop-toast", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("shop-demo-logged-in");
    localStorage.removeItem("shop-demo-role");
    localStorage.removeItem("shop-demo-redirect");
    setIsLoggedIn(false);
    setRole("user");
    setMenuOpen(false);
    router.push("/");
  };

  const toggleRole = () => {
    const newRole = role === "admin" ? "user" : "admin";
    localStorage.setItem("shop-demo-role", newRole);
    setRole(newRole);
    showToast(newRole === "admin" ? "관리자 모드" : "일반 모드");
  };

  if (pathname === "/login") return null;

  return (
    <header className="site-header border-b border-border bg-white sticky top-0 z-50">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] bg-foreground text-background px-6 py-3 text-sm font-medium shadow-lg animate-[fadeIn_0.2s_ease-out]">
          {toast}
        </div>
      )}

      <nav className="main-nav max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="nav-logo text-xl font-bold tracking-tight">
          SHOP
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 text-sm text-muted">
          <Link href="/" className="nav-home hover:text-foreground transition-colors">
            홈
          </Link>
          <Link href="/#home-all-products" className="nav-products hover:text-foreground transition-colors">
            상품
          </Link>
          <Link href="/cart" className="nav-cart relative hover:text-foreground transition-colors">
            장바구니
            {count > 0 && (
              <span className="cart-badge absolute -top-2 -right-5 bg-accent text-white text-[10px] w-[18px] h-[18px] rounded-full flex items-center justify-center font-medium">
                {count}
              </span>
            )}
          </Link>
          <Link href="/mypage" className="nav-mypage hover:text-foreground transition-colors">
            마이페이지
          </Link>
          {isLoggedIn && role === "admin" && (
            <Link href="/admin" className="nav-admin hover:text-foreground transition-colors">
              관리자
            </Link>
          )}
          {isLoggedIn ? (
            <div className="flex items-center gap-3 pl-4 border-l border-border">
              <span className="text-foreground font-medium">김민수님</span>
              <button
                onClick={toggleRole}
                className={`role-toggle text-[10px] px-2 py-0.5 rounded-full font-medium transition-colors ${
                  role === "admin"
                    ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {role === "admin" ? "관리자" : "일반"}
              </button>
              <button
                onClick={handleLogout}
                className="nav-logout text-xs text-muted hover:text-foreground transition-colors"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <Link href="/login" className="nav-login text-foreground font-medium pl-4 border-l border-border hover:opacity-70 transition-opacity">
              로그인
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="mobile-menu-btn md:hidden p-2 text-muted hover:text-foreground"
          aria-label="메뉴 열기"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu md:hidden border-t border-border bg-white">
          <div className="px-4 py-4 space-y-3 text-sm">
            <Link href="/" onClick={() => setMenuOpen(false)} className="block text-muted hover:text-foreground">홈</Link>
            <Link href="/#home-all-products" onClick={() => setMenuOpen(false)} className="block text-muted hover:text-foreground">상품</Link>
            <Link href="/cart" onClick={() => setMenuOpen(false)} className="block text-muted hover:text-foreground">
              장바구니 {count > 0 && <span className="text-accent font-medium">({count})</span>}
            </Link>
            <Link href="/mypage" onClick={() => setMenuOpen(false)} className="block text-muted hover:text-foreground">마이페이지</Link>
            {isLoggedIn && role === "admin" && (
              <Link href="/admin" onClick={() => setMenuOpen(false)} className="block text-muted hover:text-foreground">관리자</Link>
            )}
            {isLoggedIn ? (
              <div className="pt-3 border-t border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-foreground font-medium">김민수님</span>
                  <button
                    onClick={toggleRole}
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium transition-colors ${
                      role === "admin"
                        ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {role === "admin" ? "관리자" : "일반"}
                  </button>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs text-muted hover:text-foreground transition-colors"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <Link href="/login" onClick={() => setMenuOpen(false)} className="block pt-3 border-t border-border text-foreground font-medium">로그인</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
