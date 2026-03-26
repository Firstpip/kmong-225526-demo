import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SHOP — 데모 쇼핑몰",
  description: "자체 구축 쇼핑몰 데모",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <Header />
          <main className="main-content flex-1">{children}</main>

          <footer className="site-footer border-t border-border mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <div className="flex flex-col sm:flex-row justify-between gap-6 text-sm text-muted">
                <div>
                  <p className="font-bold text-foreground mb-2">SHOP</p>
                  <p>자체 구축 쇼핑몰 데모</p>
                  <p className="mt-1">본 사이트는 데모 목적으로 제작되었습니다.</p>
                </div>
                <div className="flex gap-8">
                  <div>
                    <p className="font-medium text-foreground mb-2">고객센터</p>
                    <p>02-1234-5678</p>
                    <p>평일 10:00 - 18:00</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-2">정책</p>
                    <p>이용약관</p>
                    <p>개인정보처리방침</p>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
