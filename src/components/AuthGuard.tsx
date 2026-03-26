"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

type GuardType = "public" | "guestOnly" | "authRequired" | "adminOnly";

interface Props {
  type: GuardType;
  children: React.ReactNode;
}

export default function AuthGuard({ type, children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("shop-demo-logged-in") === "true";
    const role = localStorage.getItem("shop-demo-role") || "user";

    if (type === "public") {
      setReady(true);
      return;
    }

    if (type === "guestOnly") {
      if (isLoggedIn) {
        router.replace("/");
        return;
      }
      setReady(true);
      return;
    }

    if (type === "authRequired") {
      if (!isLoggedIn) {
        localStorage.setItem("shop-demo-redirect", pathname);
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }
      setReady(true);
      return;
    }

    if (type === "adminOnly") {
      if (!isLoggedIn) {
        localStorage.setItem("shop-demo-redirect", pathname);
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }
      if (role !== "admin") {
        // Show a brief toast-like message via a custom event, then redirect
        window.dispatchEvent(
          new CustomEvent("shop-toast", { detail: "관리자 권한이 필요합니다" })
        );
        router.replace("/");
        return;
      }
      setReady(true);
      return;
    }
  }, [type, router, pathname]);

  if (!ready) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-border border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
