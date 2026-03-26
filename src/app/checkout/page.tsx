"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/products";
import AuthGuard from "@/components/AuthGuard";

type PaymentMethod = "card" | "bank" | "kakao";

function CheckoutPageContent() {
  const { items, getCartTotal, clearCart } = useCart();
  const [showSuccess, setShowSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [orderNumber] = useState(() => `ORD-${Date.now().toString().slice(-10)}`);
  const [toast, setToast] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };
  const [form, setForm] = useState({
    name: "김민수",
    phone: "010-1234-5678",
    zipCode: "06234",
    address: "서울특별시 강남구 테헤란로 123",
    addressDetail: "4층 401호",
    deliveryNote: "",
  });

  const total = getCartTotal();
  const shippingFee = total >= 50000 ? 0 : 3000;

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "수령인을 입력해주세요";
    if (!form.phone.trim()) newErrors.phone = "연락처를 입력해주세요";
    if (!form.zipCode.trim()) newErrors.zipCode = "우편번호를 입력해주세요";
    if (!form.address.trim()) newErrors.address = "주소를 입력해주세요";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOrder = () => {
    if (!validate()) return;
    setShowSuccess(true);
    clearCart();
  };

  if (items.length === 0 && !showSuccess) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-xl font-bold mb-2">주문할 상품이 없습니다</h1>
        <p className="text-sm text-muted mb-8">장바구니에 상품을 담아주세요.</p>
        <Link
          href="/"
          className="inline-block bg-foreground text-background px-8 py-3 text-sm font-medium hover:opacity-90 transition-opacity"
        >
          쇼핑하러 가기
        </Link>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div id="checkout-success" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-6 bg-green-50 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">주문이 완료되었습니다</h1>
          <p className="text-sm text-muted mb-2">주문번호: {orderNumber}</p>
          <p className="text-sm text-muted mb-8">
            주문하신 상품은 1~3일 이내에 배송됩니다.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/mypage"
              className="inline-block bg-foreground text-background px-6 py-3 text-sm font-medium hover:opacity-90 transition-opacity"
            >
              주문내역 확인
            </Link>
            <Link
              href="/"
              className="inline-block border border-border px-6 py-3 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              홈으로
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="page-checkout" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-foreground text-background px-6 py-3 text-sm font-medium shadow-lg animate-[fadeIn_0.2s_ease-out]">
          {toast}
        </div>
      )}
      <h1 className="text-2xl font-bold tracking-tight mb-8">주문/결제</h1>

      <div className="lg:grid lg:grid-cols-3 lg:gap-12">
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping address */}
          <section id="checkout-shipping">
            <h2 className="text-base font-bold mb-4 pb-2 border-b border-border">배송 정보</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-muted mb-1.5">수령인<span className="text-red-500 ml-0.5">*</span></label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className={`w-full px-3 py-2.5 border text-sm focus:outline-none focus:border-foreground transition-colors ${errors.name ? "border-red-400" : "border-border"}`}
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-xs text-muted mb-1.5">연락처<span className="text-red-500 ml-0.5">*</span></label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className={`w-full px-3 py-2.5 border text-sm focus:outline-none focus:border-foreground transition-colors ${errors.phone ? "border-red-400" : "border-border"}`}
                />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label className="block text-xs text-muted mb-1.5">우편번호<span className="text-red-500 ml-0.5">*</span></label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.zipCode}
                    onChange={(e) => handleChange("zipCode", e.target.value)}
                    className={`flex-1 px-3 py-2.5 border text-sm focus:outline-none focus:border-foreground transition-colors ${errors.zipCode ? "border-red-400" : "border-border"}`}
                  />
                  <button
                    type="button"
                    onClick={() => showToast("데모에서는 주소 검색이 제한됩니다")}
                    className="px-4 py-2.5 border border-border text-sm text-muted hover:text-foreground hover:border-foreground transition-colors whitespace-nowrap"
                  >
                    주소 검색
                  </button>
                </div>
                {errors.zipCode && <p className="text-xs text-red-500 mt-1">{errors.zipCode}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs text-muted mb-1.5">기본 주소<span className="text-red-500 ml-0.5">*</span></label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  className={`w-full px-3 py-2.5 border text-sm focus:outline-none focus:border-foreground transition-colors ${errors.address ? "border-red-400" : "border-border"}`}
                />
                {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs text-muted mb-1.5">상세 주소 <span className="text-xs text-muted font-normal">(선택)</span></label>
                <input
                  type="text"
                  value={form.addressDetail}
                  onChange={(e) => handleChange("addressDetail", e.target.value)}
                  className="w-full px-3 py-2.5 border border-border text-sm focus:outline-none focus:border-foreground transition-colors"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs text-muted mb-1.5">배송 요청사항 <span className="text-xs text-muted font-normal">(선택)</span></label>
                <input
                  type="text"
                  value={form.deliveryNote}
                  onChange={(e) => handleChange("deliveryNote", e.target.value)}
                  placeholder="예: 부재 시 경비실에 맡겨주세요"
                  className="w-full px-3 py-2.5 border border-border text-sm focus:outline-none focus:border-foreground transition-colors"
                />
              </div>
            </div>
          </section>

          {/* Order items */}
          <section>
            <h2 className="text-base font-bold mb-4 pb-2 border-b border-border">주문 상품</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={`${item.productId}-${item.color}-${item.size}`} className="flex gap-4">
                  <div className="relative w-16 h-20 bg-gray-100 flex-shrink-0 overflow-hidden">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                    <p className="text-xs text-muted mt-0.5">{item.color} / {item.size}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-muted">수량: {item.quantity}</span>
                      <span className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Payment method */}
          <section id="checkout-payment">
            <h2 className="text-base font-bold mb-4 pb-2 border-b border-border">결제 방법</h2>
            <div className="grid grid-cols-3 gap-3">
              {([
                { value: "card" as const, label: "카드결제" },
                { value: "bank" as const, label: "무통장입금" },
                { value: "kakao" as const, label: "카카오페이" },
              ]).map((method) => (
                <button
                  key={method.value}
                  onClick={() => setPaymentMethod(method.value)}
                  className={`py-3 text-sm border transition-colors ${
                    paymentMethod === method.value
                      ? "border-foreground bg-foreground text-background font-medium"
                      : "border-border text-muted hover:border-foreground hover:text-foreground"
                  }`}
                >
                  {method.label}
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Summary sidebar */}
        <div className="mt-8 lg:mt-0">
          <div id="checkout-summary" className="bg-gray-50 p-6 sticky top-24">
            <h2 className="text-sm font-bold mb-4">결제 금액</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">상품 금액</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">배송비</span>
                <span>{shippingFee === 0 ? "무료" : formatPrice(shippingFee)}</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between font-bold">
                <span>총 결제금액</span>
                <span className="text-lg">{formatPrice(total + shippingFee)}</span>
              </div>
            </div>
            <button
              id="checkout-submit-btn"
              onClick={handleOrder}
              className="block w-full mt-6 bg-foreground text-background text-center py-3.5 text-sm font-medium hover:opacity-90 transition-opacity"
            >
              결제하기
            </button>
            <p className="text-[11px] text-muted text-center mt-3">
              주문 내용을 확인하였으며, 결제에 동의합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <AuthGuard type="authRequired">
      <CheckoutPageContent />
    </AuthGuard>
  );
}
