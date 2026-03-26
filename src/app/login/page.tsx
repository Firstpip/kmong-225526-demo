"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";

type Tab = "login" | "signup";

function LoginPageContent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("login");
  const [toast, setToast] = useState<string | null>(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});

  // Signup form state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupPasswordConfirm, setSignupPasswordConfirm] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupErrors, setSignupErrors] = useState<Record<string, string>>({});

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  const doLogin = () => {
    localStorage.setItem("shop-demo-logged-in", "true");
    localStorage.setItem("shop-demo-role", "user");
    const redirect = localStorage.getItem("shop-demo-redirect");
    localStorage.removeItem("shop-demo-redirect");
    showToast("로그인 되었습니다");
    setTimeout(() => router.push(redirect || "/"), 1000);
  };

  const validateLogin = (): boolean => {
    const errors: Record<string, string> = {};
    if (!loginEmail.trim()) errors.email = "이메일을 입력해주세요";
    if (!loginPassword.trim()) errors.password = "비밀번호를 입력해주세요";
    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateSignup = (): boolean => {
    const errors: Record<string, string> = {};
    if (!signupName.trim()) errors.name = "이름을 입력해주세요";
    if (!signupEmail.trim()) errors.email = "이메일을 입력해주세요";
    if (!signupPassword.trim()) errors.password = "비밀번호를 입력해주세요";
    if (!signupPasswordConfirm.trim()) errors.passwordConfirm = "비밀번호 확인을 입력해주세요";
    else if (signupPassword !== signupPasswordConfirm) errors.passwordConfirm = "비밀번호가 일치하지 않습니다";
    setSignupErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLogin()) return;
    doLogin();
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignup()) return;
    showToast("회원가입이 완료되었습니다");
    setActiveTab("login");
  };

  const tabs: { value: Tab; label: string }[] = [
    { value: "login", label: "로그인" },
    { value: "signup", label: "회원가입" },
  ];

  const inputBase = "w-full px-4 py-2.5 text-sm border bg-white focus:outline-none focus:border-foreground transition-colors";

  return (
    <div id="page-login" className="max-w-md mx-auto px-4 py-12 sm:py-20">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-foreground text-background px-6 py-3 text-sm font-medium shadow-lg animate-[fadeIn_0.2s_ease-out]">
          {toast}
        </div>
      )}

      <h1 className="text-2xl font-bold tracking-tight text-center mb-8">
        SHOP
      </h1>

      {/* Tabs */}
      <div className="flex border-b border-border mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            id={tab.value === "login" ? "login-tab" : "signup-tab"}
            onClick={() => setActiveTab(tab.value)}
            className={`flex-1 px-5 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.value
                ? "border-b-2 border-foreground text-foreground"
                : "text-muted hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Login form */}
      {activeTab === "login" && (
        <form id="login-form" onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">이메일<span className="text-red-500 ml-0.5">*</span></label>
            <input
              type="email"
              value={loginEmail}
              onChange={(e) => { setLoginEmail(e.target.value); setLoginErrors(prev => ({...prev, email: ""})); }}
              placeholder="email@example.com"
              className={`${inputBase} ${loginErrors.email ? "border-red-400" : "border-border"}`}
            />
            {loginErrors.email && <p className="text-xs text-red-500 mt-1">{loginErrors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">비밀번호<span className="text-red-500 ml-0.5">*</span></label>
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => { setLoginPassword(e.target.value); setLoginErrors(prev => ({...prev, password: ""})); }}
              placeholder="비밀번호를 입력하세요"
              className={`${inputBase} ${loginErrors.password ? "border-red-400" : "border-border"}`}
            />
            {loginErrors.password && <p className="text-xs text-red-500 mt-1">{loginErrors.password}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
          >
            로그인
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted">또는</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Social login */}
          <button
            id="login-naver-btn"
            type="button"
            onClick={() => {
              showToast("네이버 로그인 되었습니다");
              doLogin();
            }}
            className="w-full py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#03C75A" }}
          >
            네이버로 로그인
          </button>
          <button
            id="login-kakao-btn"
            type="button"
            onClick={() => {
              showToast("카카오 로그인 되었습니다");
              doLogin();
            }}
            className="w-full py-3 text-sm font-medium transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#FEE500", color: "#191919" }}
          >
            카카오로 로그인
          </button>

          <p className="text-center text-sm text-muted pt-4">
            아직 회원이 아니신가요?{" "}
            <button
              type="button"
              onClick={() => setActiveTab("signup")}
              className="text-foreground font-medium hover:underline"
            >
              회원가입
            </button>
          </p>
        </form>
      )}

      {/* Signup form */}
      {activeTab === "signup" && (
        <form id="signup-form" onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">이름<span className="text-red-500 ml-0.5">*</span></label>
            <input
              type="text"
              value={signupName}
              onChange={(e) => { setSignupName(e.target.value); setSignupErrors(prev => ({...prev, name: ""})); }}
              placeholder="홍길동"
              className={`${inputBase} ${signupErrors.name ? "border-red-400" : "border-border"}`}
            />
            {signupErrors.name && <p className="text-xs text-red-500 mt-1">{signupErrors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">이메일<span className="text-red-500 ml-0.5">*</span></label>
            <input
              type="email"
              value={signupEmail}
              onChange={(e) => { setSignupEmail(e.target.value); setSignupErrors(prev => ({...prev, email: ""})); }}
              placeholder="email@example.com"
              className={`${inputBase} ${signupErrors.email ? "border-red-400" : "border-border"}`}
            />
            {signupErrors.email && <p className="text-xs text-red-500 mt-1">{signupErrors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">비밀번호<span className="text-red-500 ml-0.5">*</span></label>
            <input
              type="password"
              value={signupPassword}
              onChange={(e) => { setSignupPassword(e.target.value); setSignupErrors(prev => ({...prev, password: ""})); }}
              placeholder="8자 이상 입력하세요"
              className={`${inputBase} ${signupErrors.password ? "border-red-400" : "border-border"}`}
            />
            {signupErrors.password && <p className="text-xs text-red-500 mt-1">{signupErrors.password}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">비밀번호 확인<span className="text-red-500 ml-0.5">*</span></label>
            <input
              type="password"
              value={signupPasswordConfirm}
              onChange={(e) => { setSignupPasswordConfirm(e.target.value); setSignupErrors(prev => ({...prev, passwordConfirm: ""})); }}
              placeholder="비밀번호를 다시 입력하세요"
              className={`${inputBase} ${signupErrors.passwordConfirm ? "border-red-400" : "border-border"}`}
            />
            {signupErrors.passwordConfirm && <p className="text-xs text-red-500 mt-1">{signupErrors.passwordConfirm}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">전화번호 <span className="text-xs text-muted font-normal">(선택)</span></label>
            <input
              type="tel"
              value={signupPhone}
              onChange={(e) => setSignupPhone(e.target.value)}
              placeholder="010-1234-5678"
              className={`${inputBase} border-border`}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity mt-2"
          >
            회원가입
          </button>

          <p className="text-center text-sm text-muted pt-4">
            이미 회원이신가요?{" "}
            <button
              type="button"
              onClick={() => setActiveTab("login")}
              className="text-foreground font-medium hover:underline"
            >
              로그인
            </button>
          </p>
        </form>
      )}

      <div className="mt-12 pt-8 border-t border-border">
        <Link
          href="/"
          className="text-sm text-muted hover:text-foreground transition-colors"
        >
          &larr; 홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthGuard type="guestOnly">
      <LoginPageContent />
    </AuthGuard>
  );
}
